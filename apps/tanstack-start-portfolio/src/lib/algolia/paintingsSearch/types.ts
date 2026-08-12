export type PaintingsSortKey = 'featured' | 'newest' | 'oldest' | 'views' | 'likes';

export type PaintingsFacetItem = {
  label: string;
  value: string;
  count: number;
  isRefined: boolean;
};

export type PaintingAlgoliaHit = Record<string, unknown> & { objectID: string };

export type PaintingsSearchResults = {
  hits: PaintingAlgoliaHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: {
    tags?: Record<string, number>;
    dominantColors?: Record<string, number>;
  };
};
