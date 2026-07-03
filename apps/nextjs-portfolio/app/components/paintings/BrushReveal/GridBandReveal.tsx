'use client';

import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { BrushProfileConfig } from '@/app/components/marketing/HeroSection/brushStrokeConstants';
import type { BrushStrokeLayer } from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import { useBrushReveal } from './BrushRevealContext';
import {
  bandEnterFromRight,
  bandSideClipPath,
  GRID_BAND_TRANSITION_STROKES,
  GRID_BAND_VIEWBOX,
} from './bandBrushPaths';
import { brushBandOverlayEnterDelay } from './brushRevealMotion';
import {
  gridBandDrawPathTransitions,
  gridBandSideClipTransition,
  resolveBrushLayerMetrics,
} from './brushStrokeRender';

type GridBandRevealProps = {
  seed: number;
  accentColor: string;
  secondaryColor: string;
  brushProfile: BrushProfileConfig;
  liteMode: boolean;
};

function TransitionDrawStroke({
  layer,
  color,
  brushProfile,
  liteMode,
}: {
  layer: BrushStrokeLayer;
  color: string;
  brushProfile: BrushProfileConfig;
  liteMode: boolean;
}) {
  const { isActive, reduceMotion } = useBrushReveal();
  const metrics = resolveBrushLayerMetrics(
    layer,
    brushProfile.rest,
    brushProfile.hover,
    brushProfile.strokeOpacity,
    false,
    false,
  );
  const { restWidth, hoverWidth, peakOpacity } = metrics;
  const pathTransitions = gridBandDrawPathTransitions(isActive, reduceMotion, liteMode);

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

/**
 * Grid search — GSAP page-transition style, revealed from the left or right
 * (seeded per card). Organic paths + stroke-width 200 → 700.
 */
export function GridBandReveal({
  seed,
  accentColor,
  secondaryColor,
  brushProfile,
  liteMode,
}: GridBandRevealProps) {
  const { isActive, reduceMotion } = useBrushReveal();
  const fromRight = bandEnterFromRight(seed);
  const colors = [accentColor, secondaryColor] as const;
  const clipTransition = gridBandSideClipTransition(isActive, reduceMotion, liteMode);
  const strokeBlendMode = brushProfile.strokeBlendMode;

  return (
    <motion.div
      className='absolute inset-0'
      initial={false}
      animate={{ clipPath: bandSideClipPath(fromRight, isActive) }}
      transition={clipTransition}
    >
      <svg
        className='pointer-events-none absolute inset-0 h-full w-full'
        viewBox={GRID_BAND_VIEWBOX}
        preserveAspectRatio='none'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden
        style={
          strokeBlendMode ? ({ mixBlendMode: strokeBlendMode } satisfies CSSProperties) : undefined
        }
      >
        <title>Decorative brush strokes</title>
        {GRID_BAND_TRANSITION_STROKES.map((layer, index) => (
          <TransitionDrawStroke
            key={layer.d.slice(0, 24)}
            layer={layer}
            color={colors[index] ?? accentColor}
            brushProfile={brushProfile}
            liteMode={liteMode}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function gridBandOverlayDelay(_seed: number, lite: boolean): number {
  return brushBandOverlayEnterDelay(lite);
}
