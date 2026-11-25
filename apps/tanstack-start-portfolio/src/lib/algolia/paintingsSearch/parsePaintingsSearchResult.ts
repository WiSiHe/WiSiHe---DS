import { PAINTINGS_HITS_PER_PAGE } from './constants';
import type { PaintingAlgoliaHit, PaintingsSearchResults } from './types';

export function parsePaintingsSearchResult(result: unknown): PaintingsSearchResults | null {
  if (!result || typeof result !== 'object') return null;
  const r = result as Record<string, unknown>;
  if (!Array.isArray(r.hits)) return null;

  const facetsRaw = r.facets;
  const facets =
    facetsRaw && typeof facetsRaw === 'object'
      ? (facetsRaw as PaintingsSearchResults['facets'])
      : {};

  return {
    hits: r.hits as PaintingAlgoliaHit[],
    nbHits: typeof r.nbHits === 'number' ? r.nbHits : 0,
    page: typeof r.page === 'number' ? r.page : 0,
    nbPages: typeof r.nbPages === 'number' ? r.nbPages : 0,
    hitsPerPage: typeof r.hitsPerPage === 'number' ? r.hitsPerPage : PAINTINGS_HITS_PER_PAGE,
    facets,
  };
}

/**
 * Parses the responses of `buildPaintingsSearchRequests`: the first is the main result, any
 * others carry the disjunctive facet counts that replace the main result's counts.
 */
export function parsePaintingsSearchResults(results: unknown[]): PaintingsSearchResults | null {
  const main = parsePaintingsSearchResult(results[0]);
  if (!main) return null;

  for (const extra of results.slice(1)) {
    const parsedExtra = parsePaintingsSearchResult(extra);
    if (parsedExtra) Object.assign(main.facets, parsedExtra.facets);
  }

  return main;
}
