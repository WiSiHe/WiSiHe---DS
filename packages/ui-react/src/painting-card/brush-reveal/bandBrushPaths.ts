import {
  type BrushStrokeLayer,
  type GridBandConfig,
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
  if (!layer.mirror) return rotate;
  return `${rotate} scale(-1 1) translate(${-width} 0)`;
}

/** @deprecated Use getGridBandConfig(variantIndex).layers */
export const GRID_BAND_TRANSITION_STROKES: readonly [BrushStrokeLayer, BrushStrokeLayer] =
  getGridBandConfig(0).layers;
