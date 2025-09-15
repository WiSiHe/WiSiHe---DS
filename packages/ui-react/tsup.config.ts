import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entryPoints: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  external: ['react'],
  css: false, // Don't bundle CSS since consumers use Tailwind
  ...options,
}));
