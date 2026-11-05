import { defineConfig } from 'vite-plus';

// Unit tests don't need the app's build plugins (TanStack Start, Nitro, React, Tailwind).
// `*.test.tsx` files opt into jsdom with an `@vitest-environment jsdom` docblock; the rest run in node.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ['src/**/*.test.{ts,tsx}'] },
});
