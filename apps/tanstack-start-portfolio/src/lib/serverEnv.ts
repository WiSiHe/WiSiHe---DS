import { createServerOnlyFn } from '@tanstack/react-start';

/**
 * Server-only env lookup for secrets (tokens). Checks the real environment first (Vercel, `doppler run`),
 * then Vite's `import.meta.env` so a local `.env.local` still works.
 *
 * Vite only exposes `VITE_*` names through `import.meta.env`, and it inlines any such value into every
 * bundle that references it, so never put a token behind a `VITE_` name in a deployed environment.
 * Calling this from client code throws (`createServerOnlyFn`).
 */
export const readServerEnv = createServerOnlyFn((...keys: string[]): string | undefined => {
  const viteEnv = import.meta.env as unknown as Record<string, string | undefined>;
  for (const key of keys) {
    const value = process.env[key]?.trim() || viteEnv[key]?.trim();
    if (value) return value;
  }
  return undefined;
});
