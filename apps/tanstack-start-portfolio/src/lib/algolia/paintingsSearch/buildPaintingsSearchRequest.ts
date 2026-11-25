import {
  ALGOLIA_INDEX_NAME,
  PAINTING_HIT_ATTRIBUTES,
  PAINTINGS_INDEX_FILTER,
  replicaIndexName,
} from '@/lib/algolia/constants';
import type { PaintingsSortKey } from './types';

const SORT_INDEX: Record<PaintingsSortKey, string> = {
  featured: ALGOLIA_INDEX_NAME,
  newest: replicaIndexName('newest'),
  oldest: replicaIndexName('oldest'),
  views: replicaIndexName('views'),
  likes: replicaIndexName('likes'),
};

export function paintingsSortIndex(sort: PaintingsSortKey): string {
  return SORT_INDEX[sort];
}

function buildFilterString(forSale: boolean): string {
  if (forSale) return `${PAINTINGS_INDEX_FILTER} AND isForSale:true`;
  return PAINTINGS_INDEX_FILTER;
}

function buildFacetFilters(tagFilters: string[], colorFilters: string[]): string[][] | undefined {
  const groups: string[][] = [];
  if (tagFilters.length > 0) {
    groups.push(tagFilters.map(tag => `tags:${tag}`));
  }
  if (colorFilters.length > 0) {
    groups.push(colorFilters.map(color => `dominantColors:${color}`));
  }
  return groups.length > 0 ? groups : undefined;
}

/** Algolia v5 lite client expects `params` as a URL-encoded query string, not an object. */
export function serializeAlgoliaSearchParams(
  params: Record<string, string | number | boolean | string[] | string[][] | undefined>,
): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'object') {
      parts.push(`${key}=${encodeURIComponent(JSON.stringify(value))}`);
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts.join('&');
}

type PaintingsSearchRequestOptions = {
  query: string;
  page: number;
  hitsPerPage: number;
  tagFilters: string[];
  colorFilters: string[];
  forSale: boolean;
  sort: PaintingsSortKey;
  /** Set for server-side renders so page loads don't show up as user searches in analytics. */
  analytics?: boolean;
};

export function buildPaintingsSearchRequest(options: PaintingsSearchRequestOptions) {
  const facetFilters = buildFacetFilters(options.tagFilters, options.colorFilters);

  const params = serializeAlgoliaSearchParams({
    query: options.query,
    page: options.page,
    hitsPerPage: options.hitsPerPage,
    filters: buildFilterString(options.forSale),
    ...(facetFilters ? { facetFilters } : {}),
    facets: ['tags', 'dominantColors'],
    maxValuesPerFacet: 50,
    attributesToRetrieve: [...PAINTING_HIT_ATTRIBUTES],
    // The UI never renders Algolia highlight markup; skipping it trims every hit.
    attributesToHighlight: [],
    ...(options.analytics === false ? { analytics: false } : {}),
  });

  return {
    indexName: paintingsSortIndex(options.sort),
    params,
  };
}

/**
 * Disjunctive faceting: tags (and colors) are OR-ed within a group, so the counts shown for a
 * group must ignore that group's own selection. Otherwise picking one tag collapses every other
 * tag's count to "0 / hidden". Each refined group gets one extra, hit-less request.
 */
function buildDisjunctiveFacetRequests(options: PaintingsSearchRequestOptions) {
  const groups = [
    { facet: 'tags', active: options.tagFilters.length > 0 },
    { facet: 'dominantColors', active: options.colorFilters.length > 0 },
  ] as const;

  return groups
    .filter(group => group.active)
    .map(({ facet }) => {
      const facetFilters = buildFacetFilters(
        facet === 'tags' ? [] : options.tagFilters,
        facet === 'dominantColors' ? [] : options.colorFilters,
      );

      return {
        indexName: paintingsSortIndex(options.sort),
        params: serializeAlgoliaSearchParams({
          query: options.query,
          page: 0,
          hitsPerPage: 0,
          filters: buildFilterString(options.forSale),
          ...(facetFilters ? { facetFilters } : {}),
          facets: [facet],
          maxValuesPerFacet: 50,
          attributesToRetrieve: [],
          attributesToHighlight: [],
          analytics: false,
        }),
      };
    });
}

/** The main hits request plus one facet-count request per refined facet group. */
export function buildPaintingsSearchRequests(options: PaintingsSearchRequestOptions) {
  return [buildPaintingsSearchRequest(options), ...buildDisjunctiveFacetRequests(options)];
}
