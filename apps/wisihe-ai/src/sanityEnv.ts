/**
 * Content Lake target for this Sanity App (must match the Studio workspace you edit).
 *
 * Prefer **`SANITY_APP_*`** env vars: the Sanity CLI exposes them as `process.env` in the
 * browser bundle ([App SDK configuration](https://www.sanity.io/docs/app-sdk/sdk-configuration#environment-variables)).
 *
 * Legacy **`VITE_SANITY_*`** / **`VITE_AI_*`** entries in `.env.local` still work as fallbacks.
 */

const DEFAULT_PROJECT_ID = 'cbjsv7wi';
const DEFAULT_DATASET = 'production';

/** Reads `process.env` injected by `sanity dev` / `sanity build` for `SANITY_APP_*` keys. */
export function readSanityAppProcessEnv(name: string): string | undefined {
  const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  const v = env?.[name];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function pickViteOptional(key: keyof ImportMetaEnv): string | undefined {
  const v = import.meta.env[key];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

export const PROJECT_ID =
  readSanityAppProcessEnv('SANITY_APP_PROJECT_ID') ??
  readSanityAppProcessEnv('NEXT_PUBLIC_SANITY_PROJECT_ID') ??
  readSanityAppProcessEnv('SANITY_STUDIO_PROJECT_ID') ??
  pickViteOptional('VITE_SANITY_PROJECT_ID') ??
  DEFAULT_PROJECT_ID;

export const DATASET =
  readSanityAppProcessEnv('SANITY_APP_DATASET') ??
  readSanityAppProcessEnv('NEXT_PUBLIC_SANITY_DATASET') ??
  readSanityAppProcessEnv('SANITY_STUDIO_DATASET') ??
  pickViteOptional('VITE_SANITY_DATASET') ??
  DEFAULT_DATASET;

if (
  import.meta.env.DEV &&
  readSanityAppProcessEnv('SANITY_APP_PROJECT_ID') === undefined &&
  import.meta.env.VITE_SANITY_PROJECT_ID === undefined
) {
  console.info(
    '[wisihe-ai] SANITY_APP_PROJECT_ID unset — using default project id. Set SANITY_APP_PROJECT_ID and SANITY_APP_DATASET in .env.local (same values as SANITY_STUDIO_* in apps/sanity-studio).',
  );
}
