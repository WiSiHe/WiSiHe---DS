import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { buildPaintingsSearchRequests } from './buildPaintingsSearchRequest';
import { PAINTINGS_HITS_PER_PAGE } from './constants';
import type { ParsedPaintingsSearchParams } from './parsePaintingsSearchParams';
import { parsePaintingsSearchResults } from './parsePaintingsSearchResult';
import type { PaintingsSearchResults } from './types';

function getServerSearchClient() {
  const appId = import.meta.env.VITE_ALGOLIA_APP_ID?.trim();
  const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY?.trim();
  if (!appId || !searchKey) return null;
  return algoliasearch(appId, searchKey);
}

export async function fetchPaintingsSearch(
  params: ParsedPaintingsSearchParams,
): Promise<PaintingsSearchResults | null> {
  const client = getServerSearchClient();
  if (!client) return null;

  try {
    const response = await client.search({
      requests: buildPaintingsSearchRequests({
        query: params.query,
        page: params.page,
        hitsPerPage: PAINTINGS_HITS_PER_PAGE,
        tagFilters: params.tagFilters,
        colorFilters: params.colorFilters,
        forSale: params.forSale,
        sort: params.sort,
        analytics: false,
      }),
    });

    return parsePaintingsSearchResults(response.results);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[fetchPaintingsSearch] Algolia request failed', error);
    }
    return null;
  }
}
