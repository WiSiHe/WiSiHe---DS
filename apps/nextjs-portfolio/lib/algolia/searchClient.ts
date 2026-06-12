import { liteClient as algoliasearch } from 'algoliasearch/lite';

// Literal property access — required so Next.js inlines these at build time in the client bundle.
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID?.trim() ?? '';
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY?.trim() ?? '';

export const isAlgoliaConfigured = appId.length > 0 && searchKey.length > 0;

/** Search-only lite client — never use the admin/write key in the browser. */
export const searchClient = isAlgoliaConfigured ? algoliasearch(appId, searchKey) : null;
