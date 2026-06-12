/** Shape of painting records in the Algolia index (subset used by the UI). */
export type PaintingSearchHit = {
  objectID: string;
  title: string;
  slug: string;
  format?: 'square' | 'landscape' | 'portrait' | string;
  tags?: string[];
  image?: {
    asset?: { _ref?: string; lqip?: string };
    alt?: string;
  } | null;
  isFeatured?: boolean;
  isNSFW?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  medium?: string | null;
  dominantColors?: string[];
};
