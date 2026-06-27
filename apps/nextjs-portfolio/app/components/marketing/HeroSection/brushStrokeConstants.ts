/** Full-bleed hero backgrounds (if used at strokeScale 1). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

export type BrushStrokeProfile = 'masonry' | 'heroCard' | 'heroSpotlight' | 'heroBlend';

export type BrushProfileConfig = {
  rest: number;
  hover: number;
  layerSizePercent: number;
  coverScale: (variantScale: number) => number;
  strokeBlur: number;
  /** Peak stroke opacity on hover (spotlight keeps artwork visible). */
  strokeOpacity: number;
  /** How many SVG path layers to draw. */
  layerCount: number;
};

const MASONRY_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 32,
  hover: 54,
  layerSizePercent: 172,
  coverScale: variantScale => Math.min(variantScale * 0.88, 2),
  strokeBlur: 2.45,
  strokeOpacity: 1,
  layerCount: 4,
};

/** Full paint-over for grid cards when metadata replaces the artwork. */
const HERO_CARD_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 44,
  hover: 88,
  layerSizePercent: 190,
  coverScale: variantScale => Math.min(variantScale, 2.5),
  strokeBlur: 2.6,
  strokeOpacity: 1,
  layerCount: 4,
};

/** Hero collage — thin accent strokes; artwork stays visible. */
const HERO_SPOTLIGHT_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 20,
  hover: 34,
  layerSizePercent: 128,
  coverScale: variantScale => Math.min(variantScale * 0.52, 1.25),
  strokeBlur: 1.2,
  strokeOpacity: 0.62,
  layerCount: 2,
};

/** Hero collage — blend on strokes only (no full-card wash). */
const HERO_BLEND_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 26,
  hover: 50,
  layerSizePercent: 218,
  coverScale: variantScale => Math.min(variantScale * 1.12, 2.75),
  strokeBlur: 2.65,
  strokeOpacity: 0.98,
  layerCount: 2,
};

export function getBrushProfileConfig(profile: BrushStrokeProfile): BrushProfileConfig {
  if (profile === 'heroCard') return HERO_CARD_BRUSH_PROFILE;
  if (profile === 'heroSpotlight') return HERO_SPOTLIGHT_BRUSH_PROFILE;
  if (profile === 'heroBlend') return HERO_BLEND_BRUSH_PROFILE;
  return MASONRY_BRUSH_PROFILE;
}

/** @deprecated Use getBrushProfileConfig('masonry') */
export const CARD_BRUSH_STROKE_SCALE = 0.4;
