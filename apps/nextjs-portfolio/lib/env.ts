/**
 * Canonical environment variable names for the Next.js portfolio app.
 * Deprecated aliases are read as fallbacks — see docs/env-variables.md.
 *
 * NEXT_PUBLIC_* accessors MUST use static `process.env.NEXT_PUBLIC_*` reads so
 * Next.js can inline them into the client bundle. Dynamic `process.env[key]`
 * lookups are not replaced and are undefined in the browser.
 */

function trim(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function requirePublicEnv(value: string | undefined, name: string): string {
  const trimmed = trim(value);
  if (!trimmed) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return trimmed;
}

// Sanity (client — NEXT_PUBLIC_ required by Next.js)
export const sanityProjectId = () =>
  requirePublicEnv(process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'], 'NEXT_PUBLIC_SANITY_PROJECT_ID');
export const sanityDataset = () =>
  requirePublicEnv(process.env['NEXT_PUBLIC_SANITY_DATASET'], 'NEXT_PUBLIC_SANITY_DATASET');
export const sanityApiVersion = () =>
  trim(process.env['NEXT_PUBLIC_SANITY_API_VERSION']) ?? '2024-10-28';
export const sanityStudioUrl = () =>
  trim(process.env['NEXT_PUBLIC_SANITY_STUDIO_URL']) ?? 'http://localhost:3333';
// Tokens use server-only names (no NEXT_PUBLIC_ prefix): Next inlines NEXT_PUBLIC_ values into client bundles and
// Vercel can't store them as Secrets. The NEXT_PUBLIC_ names are a fallback while Doppler/Vercel are migrated.
export const sanityReadToken = () =>
  trim(process.env['SANITY_API_READ_TOKEN']) ??
  trim(process.env['NEXT_PUBLIC_SANITY_API_READ_TOKEN']);
export const sanityWriteToken = () =>
  trim(process.env['SANITY_API_WRITE_TOKEN']) ??
  trim(process.env['NEXT_PUBLIC_SANITY_API_WRITE_TOKEN']);

// Algolia (client)
export const algoliaAppId = () => trim(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) ?? '';
export const algoliaSearchKey = () => trim(process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) ?? '';
export const algoliaIndexName = () =>
  trim(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME) ?? 'wisihe-search';

// Analytics (client)
export const posthogKey = () => trim(process.env.NEXT_PUBLIC_POSTHOG_KEY);
export const posthogHost = () =>
  trim(process.env.NEXT_PUBLIC_POSTHOG_HOST) ?? 'https://eu.i.posthog.com';

// Maps (client)
export const mapboxAccessToken = () => trim(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

// AI proxy (server)
export const sanityAiProxySecret = () => readEnv('SANITY_AI_PROXY_SECRET', 'SANITY_AI_BULK_SECRET');
export const sanityAiProxyAllowedOrigins = () =>
  readEnv('SANITY_AI_PROXY_ALLOWED_ORIGINS', 'SANITY_AI_BULK_ALLOWED_ORIGINS');
export const openaiApiKey = () => readEnv('OPENAI_API_KEY');
export const openaiTagSuggestModel = () => readEnv('OPENAI_TAG_SUGGEST_MODEL') ?? 'gpt-5.4-nano';

// Media (server)
export const youtubeApiKey = () => readEnv('YOUTUBE_API_KEY');

// Dev / design system (client)
export const storybookUrl = () =>
  trim(process.env.NEXT_PUBLIC_STORYBOOK_URL) ?? 'http://localhost:6006';
