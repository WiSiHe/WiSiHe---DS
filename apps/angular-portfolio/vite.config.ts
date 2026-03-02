/// <reference types="vitest" />

import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  optimizeDeps: {
    exclude: [
      '@wisihe/constants',
      '@wisihe/sanity-queries',
      '@wisihe/tokens',
      '@wisihe/ui-angular',
      '@wisihe/utils',
    ],
  },
  plugins: [analog(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
