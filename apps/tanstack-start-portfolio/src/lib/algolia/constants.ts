export const ALGOLIA_INDEX_NAME =
  import.meta.env.VITE_ALGOLIA_INDEX_NAME?.trim() || 'wisihe-search';

export const ALGOLIA_REPLICA_SUFFIX = {
  newest: 'newest',
  oldest: 'oldest',
  views: 'views',
  likes: 'likes',
} as const;

export function replicaIndexName(suffix: keyof typeof ALGOLIA_REPLICA_SUFFIX): string {
  return `${ALGOLIA_INDEX_NAME}_${ALGOLIA_REPLICA_SUFFIX[suffix]}`;
}

/** Default filter for the paintings gallery — paintings only (NSFW included, blurred in UI). */
export const PAINTINGS_INDEX_FILTER = '_type:"painting"';

/** Paintings gallery with the “For sale” shop filter pre-applied. */
export function paintingsShopHref(): string {
  const params = new URLSearchParams();
  params.set('sale', 'true');
  return `/paintings?${params.toString()}`;
}

/** Fields returned to the browser — keeps Algolia responses small. */
export const PAINTING_HIT_ATTRIBUTES = [
  'objectID',
  'title',
  'slug',
  'format',
  'tags',
  'image',
  'isFeatured',
  'isNSFW',
  'isForSale',
  'hasStoreLink',
  'isFanArt',
  'video',
  'imagesCount',
  'medium',
  'paintedAt',
  'dominantColors',
] as const;
