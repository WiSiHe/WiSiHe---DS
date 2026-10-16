import tailwind from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, lazyPlugins } from 'vite-plus';

// Edge caching (Vercel ISR). Only enabled when ISR_BYPASS_TOKEN is set at build time, so local dev and
// token-less builds keep rendering on every request. Preview/draft requests carry a matching
// `__prerender_bypass` cookie (set by /api/draft-mode/enable) and skip the cache.
const isrBypassToken = process.env.ISR_BYPASS_TOKEN?.trim();

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 1337,
  },
  plugins: lazyPlugins(() => [
    tanstackStart(),
    nitro(
      isrBypassToken
        ? {
            vercel: { config: { bypassToken: isrBypassToken } },
            routeRules: {
              '/**': { isr: { expiration: 60 } },
              // dynamic endpoints, cookies and proxies must never be cached
              '/api/**': { isr: false },
              '/ingest/**': { isr: false },
              '/_serverFn/**': { isr: false },
            },
          }
        : undefined,
    ),
    tailwind(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ]),
});
