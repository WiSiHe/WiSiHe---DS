import { liteClient as algoliasearch } from 'algoliasearch/lite';

function requirePublicEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to apps/nextjs-portfolio/.env.local`);
  }
  return value;
}

const appId = requirePublicEnv('NEXT_PUBLIC_ALGOLIA_APP_ID');
const searchKey = requirePublicEnv('NEXT_PUBLIC_ALGOLIA_SEARCH_KEY');

/** Search-only lite client — never use the admin/write key in the browser. */
export const searchClient = algoliasearch(appId, searchKey);
