/* global process */

import { assist } from '@sanity/assist';
import { codeInput } from '@sanity/code-input';
import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { presentationToolOptions } from './presentation/toolOptions';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';
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

        // Document internationalization
        documentInternationalization({
          supportedLanguages: [
            { id: 'en', title: 'English' },
            { id: 'no', title: 'Norwegian' },
          ],
          schemaTypes: ['recipe'],
        }),

        // Live preview and presentation
        presentationTool(presentationToolOptions),

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
