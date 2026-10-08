/**
 * Generates schema.json directly from the local schema definitions,
 * bypassing the `sanity schema extract` CLI which only returns built-ins.
 */

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSchema } from '@sanity/schema/lib/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamically import all schema types (same as schemas/index.ts)
async function loadSchemas() {
  const [
    { default: painting },
    { default: post },
    { default: project },
    { default: recipe },
    { default: video },
    { tag },
    { default: blockContent },
    { seoType },
    { redirectType },
    { socialType },
    { default: home },
    { default: settings },
    { default: about },
    { default: presentationCategory },
    presentation,
  ] = await Promise.all([
    import('./schemas/painting.tsx'),
    import('./schemas/post.ts'),
    import('./schemas/project.tsx'),
    import('./schemas/recipe.ts'),
    import('./schemas/video.ts'),
    import('./schemas/tag.tsx'),
    import('./schemas/blockContent.ts'),
    import('./schemas/seoType.ts'),
    import('./schemas/redirectType.ts'),
    import('./schemas/socialType.ts'),
    import('./schemas/singletons/home.ts'),
    import('./schemas/singletons/settings.ts'),
    import('./schemas/singletons/about.ts'),
    import('./schemas/presentationCategory.tsx'),
    import('./schemas/presentation.tsx'),
  ]);

  const {
    default: presentationDefault,
    contentSlideType,
    exampleType,
    mediaType,
    metricType,
    separatorSlideType,
    sourceType,
    titleSlideType,
    toolType,
  } = presentation;

  return [
    home,
    settings,
    about,
    painting,
    post,
    project,
    video,
    tag,
    blockContent,
    seoType,
    redirectType,
    socialType,
    recipe,
    presentationCategory,
    sourceType,
    toolType,
    exampleType,
    metricType,
    mediaType,
    contentSlideType,
    titleSlideType,
    separatorSlideType,
    presentationDefault,
  ];
}

const schemas = await loadSchemas();
const compiled = createSchema({ name: 'default', types: schemas });
const jsonSchema = compiled._original?.types ?? [];
const outPath = path.join(__dirname, 'schema.json');
writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2));
console.log(`✅ schema.json written with ${jsonSchema.length} types`);
const custom = jsonSchema.filter(
  t => !t.name.startsWith('sanity.') && !['geopoint', 'slug'].includes(t.name),
);
console.log(`   Custom types (${custom.length}): ${custom.map(t => t.name).join(', ')}`);
