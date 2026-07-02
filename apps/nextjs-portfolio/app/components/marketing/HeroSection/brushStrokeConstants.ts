import type { CSSProperties } from 'react';

/** Full-bleed hero backgrounds (if used at strokeScale 1). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

export type BrushStrokeProfile =
  | 'masonry'
  | 'heroCard'
  | 'heroSpotlight'
  | 'heroBlend'
  | 'nsfwCover';

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
  /** Peak palette wash opacity on hover. */
  washOpacity: number;
  /** CSS blur applied to the artwork on hover (px). 0 when solidFill hides the image. */
  imageBlurPx: number;
  /** Hover ends in one opaque washColor — thick strokes + full wash, artwork hidden. */
  solidFill: boolean;
  /** CSS mix-blend-mode for SVG strokes (e.g. hard-light over artwork). */
  strokeBlendMode?: CSSProperties['mixBlendMode'];
  /** CSS mix-blend-mode for palette wash over artwork. */
  washBlendMode?: CSSProperties['mixBlendMode'];
};

const MASONRY_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 32,
  hover: 120,
  layerSizePercent: 240,
  coverScale: variantScale => Math.min(variantScale * 1, 2.5),
  strokeBlur: 2.8,
  strokeOpacity: 0.88,
  layerCount: 7,
  washOpacity: 0.52,
  imageBlurPx: 0,
  solidFill: false,
  strokeBlendMode: 'hard-light',
  washBlendMode: 'soft-light',
};

/** Full paint-over for grid cards when metadata replaces the artwork. */
const HERO_CARD_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 52,
  hover: 152,
  layerSizePercent: 255,
  coverScale: variantScale => Math.min(variantScale * 1.05, 2.65),
  strokeBlur: 4,
  strokeOpacity: 1,
  layerCount: 4,
  washOpacity: 1,
  imageBlurPx: 0,
  solidFill: true,
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
  washOpacity: 1,
  imageBlurPx: 0,
  solidFill: false,
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
  washOpacity: 1,
  imageBlurPx: 0,
  solidFill: false,
  strokeBlendMode: 'hard-light',
};

/** NSFW thumbnail — soft blur with visible palette strokes painted on top at rest. */
const NSFW_COVER_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 36,
  hover: 36,
  layerSizePercent: 188,
  coverScale: variantScale => Math.min(variantScale * 0.92, 2.15),
  strokeBlur: 2.35,
  strokeOpacity: 0.88,
  layerCount: 2,
  washOpacity: 1,
  imageBlurPx: 0,
  solidFill: false,
  strokeBlendMode: 'hard-light',
  washBlendMode: 'soft-light',
};

export function getBrushProfileConfig(profile: BrushStrokeProfile): BrushProfileConfig {
  if (profile === 'heroCard') return HERO_CARD_BRUSH_PROFILE;
  if (profile === 'heroSpotlight') return HERO_SPOTLIGHT_BRUSH_PROFILE;
  if (profile === 'heroBlend') return HERO_BLEND_BRUSH_PROFILE;
  if (profile === 'nsfwCover') return NSFW_COVER_BRUSH_PROFILE;
  return MASONRY_BRUSH_PROFILE;
}

/** Safari-safe profile — drops GPU-heavy filters and blend modes, fewer layers. */
export function resolveBrushProfile(
  profile: BrushStrokeProfile,
  lite: boolean,
): BrushProfileConfig {
  const base = getBrushProfileConfig(profile);
  if (!lite) return base;

  const layerCap = base.solidFill ? 3 : 3;

  return {
    ...base,
    layerCount: Math.min(base.layerCount, layerCap),
    strokeBlur: 0,
    strokeBlendMode: undefined,
    washBlendMode: undefined,
    strokeOpacity: base.solidFill ? base.strokeOpacity : Math.min(base.strokeOpacity, 0.84),
    washOpacity: base.solidFill ? base.washOpacity : Math.min(base.washOpacity, 0.62),
  };
}

/** @deprecated Use getBrushProfileConfig('masonry') */
export const CARD_BRUSH_STROKE_SCALE = 0.4;
