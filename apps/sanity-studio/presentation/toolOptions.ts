import type { PresentationPluginOptions } from 'sanity/presentation';

import { presentationResolve } from './resolve';

const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://www.wisihe.no';

/** Stable reference — avoids duplicate Presentation "Used on" banners on HMR/re-register. */
export const presentationToolOptions = {
  resolve: presentationResolve,
  previewUrl: {
    origin: previewUrl,
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
  allowOrigins: [
    'https://wisihe.no',
    'https://www.wisihe.no',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
} satisfies PresentationPluginOptions;
