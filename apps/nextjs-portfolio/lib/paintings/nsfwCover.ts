/** Shared NSFW thumbnail treatment — art stays partially visible under a light paint-over. */
export const NSFW_IMAGE_BLUR_CLASS = 'scale-[1.02] blur-md saturate-[0.9]';

/** Palette wash at rest (0–1). Primary tuning knob — lower = more art visible. */
export const NSFW_WASH_OPACITY = 0.24;

/** Wash density on card hover / focus-within (NSFW cards only). */
export const NSFW_WASH_OPACITY_HOVER = 0.42;

/** Stroke peak opacity on hover (NSFW static cover only). */
export const NSFW_STROKE_OPACITY_HOVER = 1;

export const NSFW_MATURE_LABEL = 'Mature content';

export const NSFW_FILTER_HINT = 'Use the NSFW tag filter to view';
