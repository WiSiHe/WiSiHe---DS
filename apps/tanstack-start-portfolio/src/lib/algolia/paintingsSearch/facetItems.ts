import { tagFacetTransformItems } from '@/lib/algolia/facets';
import type { PaintingsFacetItem } from './types';

export function facetMapToItems(
  facetMap: Record<string, number> | undefined,
  refinedValues: string[],
): PaintingsFacetItem[] {
  if (!facetMap) return [];

  return Object.entries(facetMap).map(([value, count]) => ({
    label: value,
    value,
    count,
    isRefined: refinedValues.includes(value),
  }));
}

export function buildTagFacetItems(
  facetMap: Record<string, number> | undefined,
  refinedTags: string[],
): PaintingsFacetItem[] {
  return tagFacetTransformItems(facetMapToItems(facetMap, refinedTags));
}

export function isNsfwTagFilterActive(tagFilters: string[]): boolean {
  return tagFilters.some(tag => tag.trim().toUpperCase() === 'NSFW');
}
