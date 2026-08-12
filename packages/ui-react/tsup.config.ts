import { defineConfig } from 'tsup';

export default defineConfig(options => ({
  entryPoints: {
    index: 'src/index.tsx',
    skeleton: 'src/skeleton/Skeleton.tsx',
    motion: 'src/motion/motionTokens.ts',
    pagination: 'src/pagination/buildPaginationItems.ts',
    'painting-card/layout': 'src/painting-card/layout.ts',
    'painting-card/nsfw-cover': 'src/painting-card/nsfwCover.ts',
    'painting-card/brush-stroke-colors': 'src/painting-card/brush-stroke/brushStrokeColors.ts',
    'painting-card/brush-stroke-variants': 'src/painting-card/brush-stroke/brushStrokeVariants.ts',
    'painting-card/brush-stroke-constants':
      'src/painting-card/brush-stroke/brushStrokeConstants.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  external: ['react', 'react-dom', '@wisihe/utils', 'motion', 'motion/react'],
  css: false, // Don't bundle CSS since consumers use Tailwind
  ...options,
}));
