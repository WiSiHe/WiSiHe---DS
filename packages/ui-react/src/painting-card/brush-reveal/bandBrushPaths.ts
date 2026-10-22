import { contrastingTint } from '../brush-stroke/brushContrast';
import {
  BRUSH_STROKE_VARIANTS,
  type BrushStrokeLayer,
  type GridBandConfig,
  type GridBandVariantTiming,
  type GridBandWipe,
  getGridBandConfig,
} from '../brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from '../layout';

/** Page-transition viewBox — stretched with preserveAspectRatio="none". */
export const GRID_BAND_VIEWBOX = '0 0 2453 2535';

export const GRID_BAND_STROKE_COUNT = 2;

export { type GridBandConfig, type GridBandWipe, getGridBandConfig };

/** Dense painted coverage: portrait nearly full, wide formats boosted to close edge gaps. */
export function formatCoverageScale(format: PaintingFormat = 'portrait'): number {
  if (format === 'landscape') return 1.38;
  if (format === 'square') return 1.32;
  return 1.22;
}

/** Even seeds enter from the left; odd seeds from the right. */
export function bandEnterFromRight(seed: number): boolean {
  return seed % 2 === 1;
}

export function bandSideClipPath(fromRight: boolean, open: boolean): string {
  return bandClipPath({ axis: 'horizontal' }, fromRight, open);
}

/** Clip path for horizontal (seed L/R) or vertical (fixed top/bottom) band wipes. */
export function bandClipPath(wipe: GridBandWipe, fromRight: boolean, open: boolean): string {
  if (open) return 'inset(0 0 0 0)';

  if (wipe.axis === 'horizontal') {
    return fromRight ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
  }

  return wipe.from === 'top' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
}

export function bandLayerTransform(layer: BrushStrokeLayer, viewBox: string): string {
  const parts = viewBox.split(/\s+/).map(Number);
  const width = parts[2] ?? 1000;
  const height = parts[3] ?? 1000;
  const cx = width / 2;
  const cy = height / 2;
  const rotate = `rotate(${layer.rotateDeg} ${cx} ${cy})`;
  const mirror = layer.mirror ? ` scale(-1 1) translate(${-width} 0)` : '';
  const flip = layer.flipY ? ` scale(1 -1) translate(0 ${-height})` : '';
  return `${rotate}${mirror}${flip}`;
}

/** @deprecated Use getGridBandConfig(variantIndex).layers */
export const GRID_BAND_TRANSITION_STROKES: readonly [BrushStrokeLayer, BrushStrokeLayer] =
  getGridBandConfig(0).layers;

/** Wipe keyframes with a small anticipation: closed, nudge open, pull back, then fully open. */
export function bandClipAnticipation(wipe: GridBandWipe, fromRight: boolean): string[] {
  const inset = (percent: number) => {
    if (wipe.axis === 'horizontal') {
      return fromRight ? `inset(0 0 0 ${percent}%)` : `inset(0 ${percent}% 0 0)`;
    }
    return wipe.from === 'top' ? `inset(${percent}% 0 0 0)` : `inset(0 0 ${percent}% 0)`;
  };
  return [inset(100), inset(94), inset(96.5), inset(0)];
}

export function seedUnit(seed: number, salt: number): number {
  let h = (seed ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export type ComposedStroke = { layer: BrushStrokeLayer; color: string };

export type ComposedBand = {
  viewBox: string;
  strokes: ComposedStroke[];
  timing: GridBandVariantTiming;
};

/**
 * Builds each card's own stroke set from the existing hand-drawn paths: strokes are borrowed from two (sometimes
 * three) different variants, in random order, each with its own rotation, mirror, vertical flip and weight.
 * Same character as the originals, but thousands of distinct combinations instead of six.
 */
export function composeBand(
  seed: number,
  variantIndex: number,
  accent: string,
  secondary: string,
): ComposedBand {
  const u = (salt: number) => seedUnit(seed, salt);
  const count = BRUSH_STROKE_VARIANTS.length;
  const base = BRUSH_STROKE_VARIANTS[variantIndex % count] ?? BRUSH_STROKE_VARIANTS[0];
  if (!base) throw new Error('No brush stroke variants');
  const pick = (offsetSalt: number, layerSalt: number, minOffset: number) => {
    const variant =
      BRUSH_STROKE_VARIANTS[
        (variantIndex + minOffset + Math.floor(u(offsetSalt) * (count - 1))) % count
      ] ?? base;
    return variant.band.layers[u(layerSalt) > 0.5 ? 1 : 0] ?? variant.band.layers[0];
  };

  const sources = [pick(10, 11, 0), pick(12, 13, 1)];
  if (u(14) > 0.5) sources.reverse();
  const withThird = u(15) > 0.55;
  if (withThird) sources.push(pick(16, 17, 2));

  const globalRotate = (u(1) - 0.5) * 24;
  const palette = u(4) > 0.5 ? [secondary, accent] : [accent, secondary];
  const colors = [
    palette[0] ?? accent,
    palette[1] ?? secondary,
    contrastingTint(palette[0] ?? accent),
  ];

  const strokes = sources.map((source, i) => ({
    layer: {
      ...source,
      rotateDeg: source.rotateDeg + globalRotate + (u(20 + i) - 0.5) * 30,
      mirror: Boolean(source.mirror) !== u(2 + i) > 0.5,
      flipY: u(30 + i) > 0.5,
      widthScale: (source.widthScale ?? 1) * (0.86 + u(40 + i) * 0.4) * (i === 2 ? 0.6 : 1),
    },
    color: colors[i] ?? accent,
  }));

  const wipe: GridBandVariantTiming['wipe'] =
    base.band.timing.wipe.axis === 'vertical' && u(52) > 0.5
      ? { axis: 'vertical', from: base.band.timing.wipe.from === 'top' ? 'bottom' : 'top' }
      : base.band.timing.wipe;

  return {
    viewBox: base.band.viewBox,
    strokes,
    timing: {
      ...base.band.timing,
      wipe,
      durationScale: base.band.timing.durationScale * (0.92 + u(50) * 0.2),
      widthScale: base.band.timing.widthScale * (0.92 + u(53) * 0.18),
      strokeStaggerSec: base.band.timing.strokeStaggerSec + (u(51) > 0.5 ? 0.06 : 0),
    },
  };
}
