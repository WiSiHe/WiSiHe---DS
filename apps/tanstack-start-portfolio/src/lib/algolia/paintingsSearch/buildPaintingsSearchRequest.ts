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

export function buildPaintingsSearchRequest(options: {
  query: string;
  page: number;
  hitsPerPage: number;
  tagFilters: string[];
  colorFilters: string[];
  forSale: boolean;
  sort: PaintingsSortKey;
}) {
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
  });

  return {
    indexName: paintingsSortIndex(options.sort),
    params,
  };
}
