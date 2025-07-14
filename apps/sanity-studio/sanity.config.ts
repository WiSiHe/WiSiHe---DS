/* global process */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';

import { schemaTypes } from './schemas';
import { assist } from '@sanity/assist';
import { media } from 'sanity-plugin-media';
import { visionTool } from '@sanity/vision';

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
export const dataset = process.env.SANITY_STUDIO_DATASET;

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://wisihe.no';

// Custom structure configuration
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Singletons
      S.listItem()
        .title('Site Configuration')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(() => '🏠')
                .child(S.document().schemaType('home').documentId('home')),
              S.listItem()
                .title('Site Settings')
                .icon(() => '🔧')
                .child(S.document().schemaType('settings').documentId('settings')),
            ]),
        ),

      // Divider
      S.divider(),

      // Main Content
      S.listItem()
        .title('Art & Creative')
        .icon(() => '🎨')
        .child(
          S.list()
            .title('Art & Creative')
            .items([
              S.listItem()
                .title('Paintings')
                .icon(() => '🖼️')
                .child(
                  S.documentTypeList('painting').title('Paintings').filter('_type == "painting"'),
                ),
              S.listItem()
                .title('Projects')
                .icon(() => '📁')
                .child(
                  S.documentTypeList('project').title('Projects').filter('_type == "project"'),
                ),
              S.listItem()
                .title('Videos')
                .icon(() => '🎥')
                .child(S.documentTypeList('video').title('Videos').filter('_type == "video"')),
            ]),
        ),

      // Content
      S.listItem()
        .title('Content')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Content')
            .items([
              S.listItem()
                .title('Recipes')
                .icon(() => '🍳')
                .child(S.documentTypeList('recipe').title('Recipes').filter('_type == "recipe"')),
            ]),
        ),

      // Management
      S.listItem()
        .title('Management')
        .icon(() => '🏷️')
        .child(
          S.list()
            .title('Management')
            .items([
              S.listItem()
                .title('Tags')
                .icon(() => '🏷️')
                .child(S.documentTypeList('tag').title('Tags').filter('_type == "tag"')),
            ]),
        ),

      // Divider
      S.divider(),

      // All documents (fallback)
      S.listItem()
        .title('Other Documents')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Other Documents')
            .items(
              (S.documentTypeListItems() as any[]).filter(
                (listItem: any) =>
                  !['home', 'settings', 'painting', 'project', 'video', 'recipe', 'tag'].includes(
                    listItem.getId() as string,
                  ),
              ),
            ),
        ),
    ]);
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

//  Main Sanity Studio configuration
export default defineConfig({
  name: 'wisihe-studio',
  title: 'WiSiHe Studio',

  projectId,
  dataset,

  plugins: [
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
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
    }),
    assist(),
    structureTool({ structure }),
    visionTool(),
    media(),
  ],
  schema: {
    types: schemaTypes,
  },
});
