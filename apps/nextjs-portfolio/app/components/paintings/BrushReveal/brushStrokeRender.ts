import type { Transition } from 'motion/react';
import type { BrushStrokeLayer } from '@/app/components/marketing/HeroSection/brushStrokeVariants';

/** Slow draw — loaded bristles trailing behind the stroke tip. */
export const BRUSH_DRAW_EASE: Transition['ease'] = [0.42, 0.03, 0.58, 0.97];

/** Width swell after the tip passes — simulates pressure on the brush. */
export const BRUSH_WIDTH_EASE: Transition['ease'] = [0.33, 0, 0.18, 1];

const POWER2_OUT: Transition['ease'] = [0.33, 1, 0.68, 1];

export type ResolvedBrushLayer = {
  widthScale: number;
  opacityScale: number;
  restWidth: number;
  hoverWidth: number;
  peakOpacity: number;
  /** Wider, softer under-paint behind the main bristle mark. */
  underWidth: number;
  underOpacity: number;
};

/** Per-layer width/opacity — keeps thin “wisp” layers in paint-over but floors them so marks stay visible. */
export function resolveBrushLayerMetrics(
  layer: BrushStrokeLayer,
  strokeWidthRest: number,
  strokeWidthHover: number,
  strokeOpacity: number,
  paintOver: boolean,
  glazeMode = false,
): ResolvedBrushLayer {
  const rawWidth = layer.widthScale ?? 1;
  const rawOpacity = layer.opacityScale ?? 1;

  const widthScale = paintOver
    ? Math.max(rawWidth, 0.68)
    : glazeMode
      ? Math.max(rawWidth, 0.88)
      : rawWidth;
  const opacityScale = paintOver ? Math.max(rawOpacity, 0.82) : rawOpacity;

  const restWidth = strokeWidthRest * 0.72 * widthScale;
  const hoverWidth = strokeWidthHover * widthScale;
  const peakOpacity = strokeOpacity * opacityScale;

  return {
    widthScale,
    opacityScale,
    restWidth,
    hoverWidth,
    peakOpacity,
    underWidth: hoverWidth * (glazeMode ? 1.52 : 1.38),
    underOpacity: peakOpacity * (glazeMode ? 0.5 : 0.42),
  };
}

/** Staggered path draw + delayed width swell + soft opacity bloom. */
export function brushStrokePathTransitions(
  index: number,
  active: boolean,
  reduced: boolean,
  layerCount: number,
  paintOver: boolean,
  lite: boolean,
  baseTransition: Transition,
  glazeMode = false,
): {
  pathLength: Transition;
  strokeWidth: Transition;
  opacity: Transition;
} {
  if (reduced) {
    const t = baseTransition;
    return { pathLength: t, strokeWidth: t, opacity: t };
  }

  if (!active && glazeMode) {
    const quickLeave = {
      delay: 0,
      duration: 0.26,
      ease: POWER2_OUT,
    } satisfies Transition;
    return { pathLength: quickLeave, strokeWidth: quickLeave, opacity: quickLeave };
  }

  const delay =
    typeof baseTransition.delay === 'number'
      ? baseTransition.delay
      : index * (paintOver ? 0.11 : glazeMode ? 0.13 : lite ? 0.035 : 0.09);

  const drawDuration =
    typeof baseTransition.duration === 'number'
      ? baseTransition.duration
      : paintOver
        ? 0.92
        : glazeMode
          ? 0.82
          : lite
            ? 0.28
            : 0.95;

  if (!active) {
    const reverseIndex = Math.max(0, layerCount - 1 - index);
    const leaveDelay =
      typeof baseTransition.delay === 'number'
        ? baseTransition.delay
        : reverseIndex * (paintOver ? 0.05 : lite ? 0.022 : 0.06);
    const leaveDuration =
      typeof baseTransition.duration === 'number'
        ? baseTransition.duration
        : paintOver
          ? 0.62
          : lite
            ? 0.2
            : 0.72;

    const leave = {
      delay: leaveDelay,
      duration: leaveDuration,
      ease: BRUSH_DRAW_EASE,
    };
    return { pathLength: leave, strokeWidth: leave, opacity: leave };
  }

  return {
    pathLength: {
      delay,
      duration: drawDuration,
      ease: BRUSH_DRAW_EASE,
    },
    strokeWidth: {
      delay: delay + 0.05,
      duration: drawDuration * 1.12,
      ease: BRUSH_WIDTH_EASE,
    },
    opacity: {
      delay: delay + 0.08,
      duration: drawDuration * 0.55,
      ease: 'easeOut',
    },
  };
}

/** Paint-over: mix palette tints so strokes read as layered pigment, not flat fill. */
export function resolveBrushLayerColors(
  layerCount: number,
  accentColor: string,
  secondaryColor: string,
  washColor: string,
  solidFill: boolean,
): string[] {
  if (!solidFill) {
    return Array.from({ length: layerCount }, (_, i) =>
      i % 2 === 0 ? accentColor : secondaryColor,
    );
  }

  return Array.from({ length: layerCount }, (_, i) => {
    if (i === layerCount - 1) return washColor;
    return i % 3 === 0 ? accentColor : i % 2 === 0 ? secondaryColor : washColor;
  });
}
