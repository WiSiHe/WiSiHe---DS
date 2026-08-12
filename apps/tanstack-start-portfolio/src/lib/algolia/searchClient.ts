import { liteClient as algoliasearch } from 'algoliasearch/lite';

const appId = import.meta.env.VITE_ALGOLIA_APP_ID?.trim() ?? '';
const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY?.trim() ?? '';

export const isAlgoliaConfigured = appId.length > 0 && searchKey.length > 0;

/** Search-only lite client — never use the admin/write key in the browser. */
export const searchClient = isAlgoliaConfigured ? algoliasearch(appId, searchKey) : null;
