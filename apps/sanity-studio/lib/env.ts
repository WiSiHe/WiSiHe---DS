/**
 * Canonical environment variable names for Sanity Studio and scripts.
 * Deprecated aliases are read as fallbacks — see docs/env-variables.md.
 *
 * NOTE: This file is bundled into the Sanity Studio client bundle (Vite).
 * Do NOT import Node.js standard modules (fs, path, url) or dotenv here,
 * as they drag in Node polyfills (e.g. path-browserify) that access `process`
 * and crash in the browser.
 */

function readEnv(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

export const studioProjectId = () =>
  readEnv(
    process.env.SANITY_STUDIO_PROJECT_ID,
    process.env.SANITY_STUDIO_API_PROJECT_ID,
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  );

export const studioDataset = () =>
  readEnv(
    process.env.SANITY_STUDIO_DATASET,
    process.env.SANITY_STUDIO_API_DATASET,
    process.env.NEXT_PUBLIC_SANITY_DATASET,
  ) ?? 'production';

export const studioPreviewUrl = () =>
  readEnv(process.env.SANITY_STUDIO_PREVIEW_URL) ?? 'https://www.wisihe.no';

export const sanityReadToken = () =>
  readEnv(process.env.SANITY_API_READ_TOKEN, process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN);

export const sanityWriteToken = () =>
  readEnv(
    process.env.SANITY_API_WRITE_TOKEN,
    process.env.SANITY_STUDIO_WRITE_TOKEN,
    process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
  );

export const algoliaAppId = () =>
  readEnv(process.env.ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) ?? '';

export const algoliaWriteKey = () => readEnv(process.env.ALGOLIA_WRITE_KEY) ?? '';

export const algoliaIndexName = () =>
  readEnv(process.env.ALGOLIA_INDEX_NAME, process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME) ??
  'wisihe-search';

export const openaiApiKey = () =>
  readEnv(process.env.OPENAI_API_KEY, process.env.SANITY_STUDIO_OPENAI_API_KEY);
