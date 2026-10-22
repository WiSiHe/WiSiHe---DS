'use client';

import { motion, type Transition } from 'motion/react';
import type { CSSProperties } from 'react';
import type { BrushProfileConfig } from '../brush-stroke/brushStrokeConstants';
import type { BrushStrokeLayer, GridBandVariantTiming } from '../brush-stroke/brushStrokeVariants';
import type { PaintingFormat } from '../layout';
import { useBrushReveal } from './BrushRevealContext';
import {
  bandClipAnticipation,
  bandClipPath,
  bandEnterFromRight,
  bandLayerTransform,
  type ComposedBand,
  formatCoverageScale,
  getGridBandConfig,
} from './bandBrushPaths';
import { brushBandOverlayEnterDelay } from './brushRevealMotion';
import {
  gridBandClipTransition,
  gridBandDrawPathTransitions,
  resolveBrushLayerMetrics,
} from './brushStrokeRender';
import { BRUSH_TEXTURE_STYLE } from './brushTexture';

type GridBandRevealProps = {
  seed: number;
  band: ComposedBand;
  brushProfile: BrushProfileConfig;
  liteMode: boolean;
  paintingFormat?: PaintingFormat;
};

/** pathLength keyframes: out, pull back (anticipation), then the full drive. */
const STROKE_ANTICIPATION = [0, 0.05, 0.035, 1];

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
        pathLength: isActive ? (reduceMotion ? 1 : STROKE_ANTICIPATION) : 0,
        strokeWidth: isActive
          ? reduceMotion
            ? hoverWidth
            : [restWidth, hoverWidth * 1.07, hoverWidth]
          : restWidth,
        opacity: isActive ? peakOpacity : 0,
      }}
      transition={pathTransitions}
    />
  );
}

/** Grid card — band wipe with variant-specific axis, timing, and stroke pairs. */
export function GridBandReveal({
  seed,
  band,
  brushProfile,
  liteMode,
  paintingFormat = 'portrait',
}: GridBandRevealProps) {
  const { isActive, reduceMotion } = useBrushReveal();
  const formatScale = formatCoverageScale(paintingFormat);
  const fromRight = bandEnterFromRight(seed);
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
      animate={{
        clipPath:
          isActive && !reduceMotion
            ? bandClipAnticipation(band.timing.wipe, fromRight)
            : bandClipPath(band.timing.wipe, fromRight, isActive),
      }}
      transition={
        isActive && !reduceMotion
          ? ({
              ...clipTransition,
              times: [0, 0.1, 0.18, 1],
              ease: ['easeOut', 'easeInOut', clipTransition.ease],
            } as Transition)
          : clipTransition
      }
    >
      <svg
        className='pointer-events-none absolute inset-0 h-full w-full'
        viewBox={band.viewBox}
        preserveAspectRatio='none'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden
        style={
          {
            ...BRUSH_TEXTURE_STYLE,
            ...(strokeBlendMode ? { mixBlendMode: strokeBlendMode } : {}),
          } satisfies CSSProperties
        }
      >
        <title>Decorative brush strokes</title>
        {band.strokes.map(({ layer, color }, index) => (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: stroke order is fixed per card
            key={index}
            transform={bandLayerTransform(layer, band.viewBox)}
          >
            <TransitionDrawStroke
              layer={layer}
              color={color}
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
