/** Shared NSFW cover helpers — cards and thumbnails use image blur only. */

export type NsfwCoverVariant = 'thumbnail' | 'card';

/** CSS blur on the image when the NSFW filter is off — artwork stays visible, detail softened. */
export const NSFW_IMAGE_BLUR_CLASS = 'scale-[1.03] blur-md saturate-[0.88]';

/** Same treatment for compact search thumbnails. */
export const NSFW_IMAGE_BLUR_THUMBNAIL_CLASS = 'scale-[1.03] blur-sm saturate-[0.9]';

export function getNsfwImageBlurClass(variant: NsfwCoverVariant = 'card'): string {
  return variant === 'thumbnail' ? NSFW_IMAGE_BLUR_THUMBNAIL_CLASS : NSFW_IMAGE_BLUR_CLASS;
}

/** Thumbnail — full opaque wash + strokes (search compact, carousel, hero). */
export const NSFW_WASH_OPACITY_THUMBNAIL = 1;

export const NSFW_WASH_OPACITY_THUMBNAIL_HOVER = 1;

export const NSFW_STROKE_OPACITY_REST_THUMBNAIL = 1;

export const NSFW_STROKE_OPACITY_HOVER_THUMBNAIL = 1;

/** Grid card — light veil over blur; artwork stays visible through strokes. */
export const NSFW_WASH_OPACITY_CARD = 0.2;

export const NSFW_WASH_OPACITY_CARD_HOVER = 0.2;

export const NSFW_STROKE_OPACITY_REST_CARD = 0.58;

export const NSFW_STROKE_OPACITY_HOVER_CARD = 0.58;

export function getNsfwWashOpacity(variant: NsfwCoverVariant, hover = false): number {
  if (variant === 'thumbnail') {
    return hover ? NSFW_WASH_OPACITY_THUMBNAIL_HOVER : NSFW_WASH_OPACITY_THUMBNAIL;
  }
  return hover ? NSFW_WASH_OPACITY_CARD_HOVER : NSFW_WASH_OPACITY_CARD;
}

export function getNsfwStrokeOpacity(variant: NsfwCoverVariant, hover = false): number {
  if (variant === 'thumbnail') {
    return hover ? NSFW_STROKE_OPACITY_HOVER_THUMBNAIL : NSFW_STROKE_OPACITY_REST_THUMBNAIL;
  }
  return hover ? NSFW_STROKE_OPACITY_HOVER_CARD : NSFW_STROKE_OPACITY_REST_CARD;
}

export const NSFW_MATURE_LABEL = 'Mature content';

export const NSFW_FILTER_HINT = 'Use the NSFW tag filter to view';

/** Short label for blurred NSFW surfaces (carousel caption, thumbnails, overlays). */
export const NSFW_COMPACT_LABEL = '18+';

const NSFW_TAG_RE = /^nsfw$/i;
const MATURE_RATING_RE = /nudity|mature|explicit|sensitive/i;

/** Human-readable NSFW rating from tags (e.g. "Mild nudity") or default label. */
export function resolveNsfwRatingLabel(tags: string[]): string {
  const normalized = tags.map(tag => tag.trim()).filter(Boolean);
  const rating = normalized.find(tag => MATURE_RATING_RE.test(tag) && !NSFW_TAG_RE.test(tag));
  return rating ?? NSFW_MATURE_LABEL;
}

/** Shorter label for blurred NSFW surfaces — always **18+**. */
export function resolveNsfwCompactLabel(_tags: string[]): string {
  return NSFW_COMPACT_LABEL;
}

/** Hide the generic NSFW tag when the cover is active; keep descriptive tags. */
export function filterTagsForNsfwCover(tags: string[]): string[] {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0 && !NSFW_TAG_RE.test(tag));
}

/** Thumbnail — broad strokes; wash provides full coverage. */
export const NSFW_THUMBNAIL_LAYER_COUNT = 3;

/** Grid card — enough strokes to read as a painted cover. */
export const NSFW_CARD_LAYER_COUNT = 3;
