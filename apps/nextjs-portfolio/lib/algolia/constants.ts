export const ALGOLIA_INDEX_NAME =
  process.env['NEXT_PUBLIC_ALGOLIA_INDEX_NAME']?.trim() || 'wisihe-search';

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
  'medium',
  'dominantColors',
] as const;
