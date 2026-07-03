import type { PaintingsSortKey } from './types';

const SORT_KEYS = new Set<PaintingsSortKey>(['featured', 'newest', 'oldest', 'views', 'likes']);

function parseSort(value: string | null | undefined): PaintingsSortKey {
  if (value && SORT_KEYS.has(value as PaintingsSortKey)) {
    return value as PaintingsSortKey;
  }
  return 'featured';
}

export type ParsedPaintingsSearchParams = {
  query: string;
  tagFilters: string[];
  colorFilters: string[];
  forSale: boolean;
  sort: PaintingsSortKey;
  page: number;
};

export function parsePaintingsSearchParams(input: {
  q?: string | null;
  tag?: string | null;
  color?: string | null;
  sale?: string | null;
  sort?: string | null;
  p?: string | null;
}): ParsedPaintingsSearchParams {
  return {
    query: input.q?.trim() || '',
    tagFilters: input.tag?.split(',').filter(Boolean) || [],
    colorFilters: input.color?.split(',').filter(Boolean) || [],
    forSale: input.sale === 'true',
    sort: parseSort(input.sort),
    page: Math.max(0, Number.parseInt(input.p || '1', 10) - 1),
  };
}
