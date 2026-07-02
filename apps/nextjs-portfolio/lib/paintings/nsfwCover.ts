/** Shared NSFW thumbnail treatment — light blur under painted brush strokes. */

export type NsfwCoverVariant = 'thumbnail' | 'card';

export const NSFW_IMAGE_BLUR_CLASS = 'scale-[1.02] blur-md saturate-[0.88]';

/** Thumbnails use the same base blur; strokes provide the cover. */
export const NSFW_IMAGE_BLUR_THUMBNAIL_CLASS = NSFW_IMAGE_BLUR_CLASS;

export function getNsfwImageBlurClass(variant: NsfwCoverVariant = 'card'): string {
  return variant === 'thumbnail' ? NSFW_IMAGE_BLUR_THUMBNAIL_CLASS : NSFW_IMAGE_BLUR_CLASS;
}

/** Palette wash at rest (0–1) — opaque so the artwork is fully covered. */
export const NSFW_WASH_OPACITY = 1;

export const NSFW_WASH_OPACITY_HOVER = 1;

/** Opaque strokes painted over the solid wash. */
export const NSFW_STROKE_OPACITY_REST = 1;

export const NSFW_STROKE_OPACITY_HOVER = 1;

export const NSFW_MATURE_LABEL = 'Mature content';

export const NSFW_FILTER_HINT = 'Use the NSFW tag filter to view';

const NSFW_TAG_RE = /^nsfw$/i;
const MATURE_RATING_RE = /nudity|mature|explicit|sensitive/i;

/** Human-readable NSFW rating from tags (e.g. "Mild nudity") or default label. */
export function resolveNsfwRatingLabel(tags: string[]): string {
  const normalized = tags.map(tag => tag.trim()).filter(Boolean);
  const rating = normalized.find(tag => MATURE_RATING_RE.test(tag) && !NSFW_TAG_RE.test(tag));
  return rating ?? NSFW_MATURE_LABEL;
}

/** Shorter label for small thumbnails (e.g. "18+" instead of "Mature content"). */
export function resolveNsfwCompactLabel(tags: string[]): string {
  const rating = resolveNsfwRatingLabel(tags);
  if (rating === NSFW_MATURE_LABEL) return '18+';
  return rating;
}

/** Hide the generic NSFW tag when the cover is active; keep descriptive tags. */
export function filterTagsForNsfwCover(tags: string[]): string[] {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0 && !NSFW_TAG_RE.test(tag));
}

/** Broad strokes only — wash provides full coverage. */
export const NSFW_THUMBNAIL_LAYER_COUNT = 3;

export const NSFW_CARD_LAYER_COUNT = 3;
