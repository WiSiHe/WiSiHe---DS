/* global process */

import { assist } from '@sanity/assist';
import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { presentationResolve } from './presentation/resolve';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

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

// Skip plugins when running CLI tools (schema extract, typegen)
// Plugins cause esbuild to fail silently during schema extraction
const isCliMode = process.env.SANITY_CLI_MODE === 'true';

// Main Sanity Studio configuration
const config = defineConfig({
  name: 'wisihe-studio',
  title: 'WiSiHe Studio',

  projectId,
  dataset,

  plugins: isCliMode
    ? []
    : ([
        // Core structure and content editing
        structureTool({ structure }),

        // Live preview and presentation
        presentationTool({
          resolve: presentationResolve,
          previewUrl: {
            origin: previewUrl,
            previewMode: {
              enable: '/api/draft-mode/enable',
            },
          },
          allowOrigins: allowedOrigins,
        }),

        codeInput(),

        // AI-powered content assistance
        assist(),

        // Media library management
        media(),

        // Development tools (only in dev mode)
        ...(isDevelopment ? [visionTool()] : []),
      ] as any), // Type assertion needed due to Sanity plugin type limitations

  schema: {
    types: schemaTypes,
  },
});

export default config;
