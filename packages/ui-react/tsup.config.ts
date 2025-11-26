import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entryPoints: ['src/index.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  external: ['react', '@wisihe/utils'],
  css: false, // Don't bundle CSS since consumers use Tailwind
  ...options,
}));
