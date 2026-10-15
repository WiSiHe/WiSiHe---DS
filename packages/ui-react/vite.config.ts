import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: {
      index: 'src/index.tsx',
      skeleton: 'src/skeleton/Skeleton.tsx',
      motion: 'src/motion/motionTokens.ts',
      pagination: 'src/pagination/buildPaginationItems.ts',
      'painting-card/layout': 'src/painting-card/layout.ts',
      'painting-card/nsfw-cover': 'src/painting-card/nsfwCover.ts',
      'painting-card/brush-stroke-colors': 'src/painting-card/brush-stroke/brushStrokeColors.ts',
      'painting-card/brush-stroke-variants':
        'src/painting-card/brush-stroke/brushStrokeVariants.ts',
      'painting-card/brush-stroke-constants':
        'src/painting-card/brush-stroke/brushStrokeConstants.ts',
    },
    tsconfig: 'tsconfig.build.json',
    format: ['esm'],
    fixedExtension: false,
    dts: true,
    sourcemap: true,
    deps: {
      neverBundle: ['react', 'react-dom', '@wisihe/utils', 'motion', 'motion/react'],
    },
    suppressWarnings: ['MODULE_LEVEL_DIRECTIVE'],
  },
});
