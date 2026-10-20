import { defineConfig } from 'vite-plus';

// Unit tests don't need the app's build plugins (TanStack Start, Nitro, React, Tailwind).
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ['src/**/*.test.ts'] },
});
