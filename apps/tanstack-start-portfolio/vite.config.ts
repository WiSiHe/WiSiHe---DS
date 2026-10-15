import tailwind from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 1337,
  },
  plugins: lazyPlugins(() => [
    tanstackStart(),
    nitro(),
    tailwind(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ]),
});
