import { PAINTINGS_HITS_PER_PAGE } from './constants';
import type { PaintingAlgoliaHit, PaintingsSearchResults } from './types';

export function parsePaintingsSearchResult(result: unknown): PaintingsSearchResults | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, unknown>;
  if (!Array.isArray(r['hits'])) return null;

  const facetsRaw = r['facets'];
  const facets =
    facetsRaw && typeof facetsRaw === 'object'
      ? (facetsRaw as PaintingsSearchResults['facets'])
      : {};

  return {
    hits: r['hits'] as PaintingAlgoliaHit[],
    nbHits: typeof r['nbHits'] === 'number' ? r['nbHits'] : 0,
    page: typeof r['page'] === 'number' ? r['page'] : 0,
    nbPages: typeof r['nbPages'] === 'number' ? r['nbPages'] : 0,
    hitsPerPage: typeof r['hitsPerPage'] === 'number' ? r['hitsPerPage'] : PAINTINGS_HITS_PER_PAGE,
    facets,
  };
}
