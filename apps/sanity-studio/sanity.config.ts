/* global process */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';

import { schemaTypes } from './schemas';
import { structure } from './structure';
import { assist } from '@sanity/assist';
import { media } from 'sanity-plugin-media';
import { visionTool } from '@sanity/vision';

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
export const dataset = process.env.SANITY_STUDIO_DATASET;

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://www.wisihe.no';

// Allowed origins for preview/presentation tools
const allowedOrigins = [
  'https://wisihe.no',
  'https://www.wisihe.no',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Main Sanity Studio configuration
const config = defineConfig({
  name: 'wisihe-studio',
  title: 'WiSiHe Studio',

  projectId,
  dataset,

  plugins: [
    // Core structure and content editing
    structureTool({ structure }),

    // Live preview and presentation
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      allowOrigins: allowedOrigins,
    }),

    // AI-powered content assistance
    assist(),

    // Media library management
    media(),

    // Development tools (only in dev mode)
    ...(isDevelopment ? [visionTool()] : []),
  ] as any, // Type assertion needed due to Sanity plugin type limitations

  schema: {
    types: schemaTypes,
  },
});

export default config;
