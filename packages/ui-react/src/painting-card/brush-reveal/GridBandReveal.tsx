'use client';

import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { BrushProfileConfig } from '../brush-stroke/brushStrokeConstants';
import type { BrushStrokeLayer, GridBandVariantTiming } from '../brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from '../layout';
import { useBrushReveal } from './BrushRevealContext';
import {
  bandClipPath,
  bandEnterFromRight,
  bandLayerTransform,
  formatCoverageScale,
  getGridBandConfig,
} from './bandBrushPaths';
import { brushBandOverlayEnterDelay } from './brushRevealMotion';
import {
  gridBandClipTransition,
  gridBandDrawPathTransitions,
  resolveBrushLayerMetrics,
} from './brushStrokeRender';

type GridBandRevealProps = {
  seed: number;
  variantIndex: number;
  accentColor: string;
  secondaryColor: string;
  brushProfile: BrushProfileConfig;
  liteMode: boolean;
  paintingFormat?: PaintingFormat;
};

function TransitionDrawStroke({
  layer,
  color,
  brushProfile,
  liteMode,
  timing,
  formatScale,
  strokeIndex,
}: {
  layer: BrushStrokeLayer;
  color: string;
  brushProfile: BrushProfileConfig;
  liteMode: boolean;
  timing: GridBandVariantTiming;
  formatScale: number;
  strokeIndex: number;
}) {
  const { isActive, reduceMotion } = useBrushReveal();
  const widthMultiplier = timing.widthScale * formatScale * (layer.widthScale ?? 1);
  const metrics = resolveBrushLayerMetrics(
    layer,
    brushProfile.rest * widthMultiplier,
    brushProfile.hover * widthMultiplier,
    brushProfile.strokeOpacity,
    false,
    false,
  );
  const { restWidth, hoverWidth, peakOpacity } = metrics;
  const pathTransitions = gridBandDrawPathTransitions(
    isActive,
    reduceMotion,
    liteMode,
    timing.durationScale,
    strokeIndex,
    timing.strokeStaggerSec,
    timing.drawEase,
  );

  return (
    <motion.path
      d={layer.d}
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
      initial={{ pathLength: 0, strokeWidth: restWidth, opacity: 0 }}
      animate={{
        pathLength: isActive ? 1 : 0,
        strokeWidth: isActive ? hoverWidth : restWidth,
        opacity: isActive ? peakOpacity : 0,
      }}
      transition={pathTransitions}
    />
  );
}

/** Grid card — band wipe with variant-specific axis, timing, and stroke pairs. */
export function GridBandReveal({
  seed,
  variantIndex,
  accentColor,
  secondaryColor,
  brushProfile,
  liteMode,
  paintingFormat = 'portrait',
}: GridBandRevealProps) {
  const { isActive, reduceMotion } = useBrushReveal();
  const band = getGridBandConfig(variantIndex);
  const formatScale = formatCoverageScale(paintingFormat);
  const fromRight = bandEnterFromRight(seed);
  const colors = [accentColor, secondaryColor] as const;
  const clipTransition = gridBandClipTransition(
    isActive,
    reduceMotion,
    liteMode,
    band.timing.durationScale,
    band.timing.drawEase,
  );
  const strokeBlendMode = brushProfile.strokeBlendMode;

  return (
    <motion.div
      className='absolute inset-0'
      initial={false}
      animate={{ clipPath: bandClipPath(band.timing.wipe, fromRight, isActive) }}
      transition={clipTransition}
    >
      <svg
        className='pointer-events-none absolute inset-0 h-full w-full'
        viewBox={band.viewBox}
        preserveAspectRatio='none'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden
        style={
          strokeBlendMode ? ({ mixBlendMode: strokeBlendMode } satisfies CSSProperties) : undefined
        }
      >
        <title>Decorative brush strokes</title>
        {band.layers.map((layer, index) => (
          <g
            key={`${layer.d.slice(0, 20)}-${layer.rotateDeg}`}
            transform={bandLayerTransform(layer, band.viewBox)}
          >
            <TransitionDrawStroke
              layer={layer}
              color={colors[index] ?? accentColor}
              brushProfile={brushProfile}
              liteMode={liteMode}
              timing={band.timing}
              formatScale={formatScale}
              strokeIndex={index}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

export function gridBandOverlayDelay(variantIndex: number, lite: boolean): number {
  const timing = getGridBandConfig(variantIndex).timing;
  return Math.max(
    0,
    brushBandOverlayEnterDelay(lite) + timing.overlayDelayOffset + timing.strokeStaggerSec,
  );
}
