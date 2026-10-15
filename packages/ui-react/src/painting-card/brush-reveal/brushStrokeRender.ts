import type { Transition } from 'motion/react';
import type { BrushStrokeLayer, GridBandDrawEase } from '../brush-stroke/brushStrokeVariants';

const BAND_STROKE_DRAW_DURATION = 0.6;
const BAND_STROKE_LEAVE_DURATION = 0.25;

/** GSAP power1.inOut — matches page-transition reference. */
export const GRID_BAND_DRAW_EASE: Transition['ease'] = [0.42, 0, 0.58, 1];

/** Slow draw — loaded bristles trailing behind the stroke tip. */
export const BRUSH_DRAW_EASE: Transition['ease'] = [0.42, 0.03, 0.58, 0.97];

/** Width swell after the tip passes — simulates pressure on the brush. */
export const BRUSH_WIDTH_EASE: Transition['ease'] = [0.33, 0, 0.18, 1];

const POWER2_OUT: Transition['ease'] = [0.33, 1, 0.68, 1];

const GRID_BAND_DRAW_EASES: Record<GridBandDrawEase, Transition['ease']> = {
  balanced: GRID_BAND_DRAW_EASE,
  snappy: POWER2_OUT,
  heavy: BRUSH_DRAW_EASE,
};

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

/** Grid band — side or vertical wipe with variant timing and easing. */
export function gridBandClipTransition(
  active: boolean,
  reduced: boolean,
  lite: boolean,
  durationScale = 1,
  drawEase: GridBandDrawEase = 'balanced',
): Transition {
  const duration = (reduced ? 0.2 : lite ? 0.5 : BAND_STROKE_DRAW_DURATION) * durationScale;
  if (!active) {
    return {
      delay: 0,
      duration: BAND_STROKE_LEAVE_DURATION,
      ease: POWER2_OUT,
    };
  }
  return { delay: 0, duration, ease: GRID_BAND_DRAW_EASES[drawEase] };
}

/** Grid band — path draw with optional second-stroke stagger and variant easing. */
export function gridBandDrawPathTransitions(
  active: boolean,
  reduced: boolean,
  lite: boolean,
  durationScale = 1,
  strokeIndex = 0,
  strokeStaggerSec = 0,
  drawEase: GridBandDrawEase = 'balanced',
): {
  pathLength: Transition;
  strokeWidth: Transition;
  opacity: Transition;
} {
  const duration = (reduced ? 0.2 : lite ? 0.5 : BAND_STROKE_DRAW_DURATION) * durationScale;
  const ease = GRID_BAND_DRAW_EASES[drawEase];
  const enterDelay = strokeIndex * strokeStaggerSec;

  if (reduced) {
    const t = { delay: enterDelay, duration, ease } satisfies Transition;
    return { pathLength: t, strokeWidth: t, opacity: t };
  }

  if (!active) {
    const leaveDelay = strokeIndex > 0 ? 0 : strokeStaggerSec * 0.35;
    const fade = {
      delay: leaveDelay,
      duration: BAND_STROKE_LEAVE_DURATION,
      ease: POWER2_OUT,
    } satisfies Transition;
    return {
      opacity: fade,
      strokeWidth: fade,
      pathLength: {
        delay: leaveDelay + BAND_STROKE_LEAVE_DURATION,
        duration: 0,
      },
    };
  }

  const draw = { delay: enterDelay, duration, ease } satisfies Transition;
  return {
    pathLength: draw,
    strokeWidth: draw,
    opacity: { delay: enterDelay + 0.04, duration: duration * 0.35, ease: 'easeOut' },
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
  wedgeMode = false,
): {
  pathLength: Transition;
  strokeWidth: Transition;
  opacity: Transition;
} {
  if (reduced) {
    const t = baseTransition;
    return { pathLength: t, strokeWidth: t, opacity: t };
  }

  if (!active && (glazeMode || wedgeMode)) {
    const quickLeave = {
      delay: 0,
      duration: wedgeMode ? BAND_STROKE_LEAVE_DURATION : 0.26,
      ease: POWER2_OUT,
    } satisfies Transition;
    const pathLengthLeave = wedgeMode
      ? { delay: BAND_STROKE_LEAVE_DURATION, duration: 0 }
      : quickLeave;
    return { pathLength: pathLengthLeave, strokeWidth: quickLeave, opacity: quickLeave };
  }

  const delay =
    typeof baseTransition.delay === 'number'
      ? baseTransition.delay
      : index * (paintOver ? 0.11 : glazeMode ? 0.13 : wedgeMode ? 0.08 : lite ? 0.035 : 0.09);

  const drawDuration =
    typeof baseTransition.duration === 'number'
      ? baseTransition.duration
      : paintOver
        ? 0.92
        : glazeMode
          ? 0.82
          : wedgeMode
            ? BAND_STROKE_DRAW_DURATION
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
