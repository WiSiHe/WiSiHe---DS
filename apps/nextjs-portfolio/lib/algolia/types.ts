/** Shape of painting records in the Algolia index (subset used by the UI). */
export type PaintingSearchHit = {
  objectID: string;
  title: string;
  slug: string;
  format?: 'square' | 'landscape' | 'portrait' | string;
  tags?: string[];
  image?: {
    asset?: { _ref?: string };
    lqip?: string;
    aspectRatio?: number | null;
    hotspot?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
    crop?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    alt?: string;
  } | null;
  palette?: {
    dominant?: { background?: string };
    vibrant?: { background?: string };
    darkVibrant?: { background?: string };
    muted?: { background?: string };
  } | null;
  isFeatured?: boolean;
  isNSFW?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  isFanArt?: boolean;
  video?: string | null;
  imagesCount?: number;
  medium?: string | null;
  paintedAt?: string | null;
  dominantColors?: string[];
};
