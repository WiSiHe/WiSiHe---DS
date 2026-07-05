import type { CSSProperties } from 'react';

/** Full-bleed hero backgrounds (legacy export). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

/** @deprecated Only grid band is supported — kept for type compatibility. */
export type BrushStrokeProfile = 'gridCard';

export type BrushProfileConfig = {
  rest: number;
  hover: number;
  layerSizePercent: number;
  coverScale: (variantScale: number) => number;
  strokeBlur: number;
  strokeOpacity: number;
  layerCount: number;
  washOpacity: number;
  imageBlurPx: number;
  solidFill: boolean;
  wedgeMode: boolean;
  strokeBlendMode?: CSSProperties['mixBlendMode'];
};

const GRID_CARD_BRUSH_PROFILE: BrushProfileConfig = {
  rest: 200,
  hover: 700,
  layerSizePercent: 100,
  coverScale: variantScale => Math.min(variantScale * 0.78, 2.05),
  strokeBlur: 0,
  strokeOpacity: 1,
  layerCount: 2,
  washOpacity: 0,
  imageBlurPx: 0,
  solidFill: false,
  wedgeMode: true,
  strokeBlendMode: 'hard-light',
};

export function getBrushProfileConfig(
  _profile: BrushStrokeProfile = 'gridCard',
): BrushProfileConfig {
  return GRID_CARD_BRUSH_PROFILE;
}

/** Safari lite — same band wipe, drop expensive blend modes. */
export function resolveBrushProfile(
  _profile: BrushStrokeProfile = 'gridCard',
  lite: boolean,
): BrushProfileConfig {
  const base = GRID_CARD_BRUSH_PROFILE;
  if (!lite) return base;

  return {
    ...base,
    strokeBlendMode: 'normal',
    strokeOpacity: Math.min(base.strokeOpacity, 0.82),
  };
}
