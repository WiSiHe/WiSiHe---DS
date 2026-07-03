import 'server-only';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { buildPaintingsSearchRequest } from './buildPaintingsSearchRequest';
import { PAINTINGS_HITS_PER_PAGE } from './constants';
import type { ParsedPaintingsSearchParams } from './parsePaintingsSearchParams';
import { parsePaintingsSearchResult } from './parsePaintingsSearchResult';
import type { PaintingsSearchResults } from './types';

function getServerSearchClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID?.trim();
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY?.trim();
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
      requests: [
        buildPaintingsSearchRequest({
          query: params.query,
          page: params.page,
          hitsPerPage: PAINTINGS_HITS_PER_PAGE,
          tagFilters: params.tagFilters,
          colorFilters: params.colorFilters,
          forSale: params.forSale,
          sort: params.sort,
        }),
      ],
    });

    return parsePaintingsSearchResult(response.results[0]);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[fetchPaintingsSearch] Algolia request failed', error);
    }
    return null;
  }
}
