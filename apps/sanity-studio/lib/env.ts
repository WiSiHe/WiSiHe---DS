/**
 * Canonical environment variable names for Sanity Studio and scripts.
 * Deprecated aliases are read as fallbacks — see docs/env-variables.md.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnvFile } from 'dotenv';

const studioRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadLocalEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const filePath = path.join(studioRoot, file);
    if (existsSync(filePath)) {
      loadEnvFile({ path: filePath });
    }
  }
}

if (
  !process.env.SANITY_STUDIO_PROJECT_ID?.trim() &&
  !process.env.SANITY_STUDIO_API_PROJECT_ID?.trim() &&
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
) {
  loadLocalEnvFiles();
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export const studioProjectId = () =>
  readEnv(
    'SANITY_STUDIO_PROJECT_ID',
    'SANITY_STUDIO_API_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
  );

export const studioDataset = () =>
  readEnv('SANITY_STUDIO_DATASET', 'SANITY_STUDIO_API_DATASET', 'NEXT_PUBLIC_SANITY_DATASET') ??
  'production';

export const studioPreviewUrl = () =>
  readEnv('SANITY_STUDIO_PREVIEW_URL') ?? 'https://www.wisihe.no';

export const sanityReadToken = () =>
  readEnv('SANITY_API_READ_TOKEN', 'NEXT_PUBLIC_SANITY_API_READ_TOKEN');

export const sanityWriteToken = () =>
  readEnv(
    'SANITY_API_WRITE_TOKEN',
    'SANITY_STUDIO_WRITE_TOKEN',
    'NEXT_PUBLIC_SANITY_API_WRITE_TOKEN',
  );

export const algoliaAppId = () => readEnv('ALGOLIA_APP_ID', 'NEXT_PUBLIC_ALGOLIA_APP_ID') ?? '';

export const algoliaWriteKey = () => readEnv('ALGOLIA_WRITE_KEY') ?? '';

export const algoliaIndexName = () =>
  readEnv('ALGOLIA_INDEX_NAME', 'NEXT_PUBLIC_ALGOLIA_INDEX_NAME') ?? 'wisihe-search';

export const openaiApiKey = () => readEnv('OPENAI_API_KEY', 'SANITY_STUDIO_OPENAI_API_KEY');
