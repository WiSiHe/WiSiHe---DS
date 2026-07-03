import type { Transition } from 'motion/react';

/** Matches legacy GSAP power1.inOut / power2 curves. */
const POWER1_IN_OUT: Transition['ease'] = [0.42, 0, 0.58, 1];
const POWER1_OUT: Transition['ease'] = [0.25, 0.1, 0.25, 1];
const POWER2_OUT: Transition['ease'] = [0.33, 1, 0.68, 1];
const POWER2_IN: Transition['ease'] = [0.32, 0, 0.67, 0];
const POWER3_OUT: Transition['ease'] = [0.22, 1, 0.36, 1];

/** Default stroke layer count when profile is unavailable. */
export const BRUSH_DEFAULT_LAYER_COUNT = 4;

/**
 * Single orchestrated enter/leave timeline (seconds).
 * Enter: wash/blur → strokes (stagger) → metadata overlay.
 * Leave: reverse — overlay → strokes (reverse stagger) → wash/blur last.
 */
const TIMELINE = {
  enter: {
    wash: { delay: 0, duration: 0.28 },
    blur: { delay: 0, duration: 0.28 },
    stroke: { delayPerIndex: 0.09, duration: 0.95 },
    overlay: { delay: 0.4, duration: 0.5 },
  },
  leave: {
    overlay: { delay: 0, duration: 0.35 },
    stroke: { delayPerReverseIndex: 0.06, duration: 0.72 },
    wash: { delay: 0.38, duration: 0.55 },
    blur: { delay: 0.38, duration: 0.55 },
  },
  reduced: { duration: 0.2 },
} as const;

/** Safari lite — opacity-only strokes, shorter timings. */
const LITE_TIMELINE = {
  enter: {
    wash: { delay: 0, duration: 0.22 },
    blur: { delay: 0, duration: 0.22 },
    stroke: { delayPerIndex: 0.035, duration: 0.28 },
    overlay: { delay: 0.16, duration: 0.36 },
  },
  leave: {
    overlay: { delay: 0, duration: 0.26 },
    stroke: { delayPerReverseIndex: 0.022, duration: 0.2 },
    wash: { delay: 0.2, duration: 0.32 },
    blur: { delay: 0.2, duration: 0.32 },
  },
} as const;

/** Solid paint-over: strokes lead, wash seals to flat color, artwork fades under. */
const PAINT_OVER_TIMELINE = {
  enter: {
    wash: { delay: 0.48, duration: 0.42 },
    blur: { delay: 0, duration: 0.32 },
    imageFade: { delay: 0.08, duration: 0.38 },
    stroke: { delayPerIndex: 0.11, duration: 0.92 },
    overlay: { delay: 0.62, duration: 0.45 },
  },
  leave: {
    overlay: { delay: 0, duration: 0.32 },
    stroke: { delayPerReverseIndex: 0.05, duration: 0.62 },
    wash: { delay: 0.12, duration: 0.42 },
    blur: { delay: 0.28, duration: 0.48 },
    imageFade: { delay: 0.28, duration: 0.48 },
  },
} as const;

/** Semi-transparent glaze — CSS smear passes, metadata after; hybrid exit. */
const GLAZE_TIMELINE = {
  enter: {
    wash: { delay: 0.06, duration: 0.72 },
    blur: { delay: 0, duration: 0.72 },
    stroke: { delayPerIndex: 0.11, duration: 0.78 },
    overlay: { delay: 0.9, duration: 0.36 },
  },
  leave: {
    overlay: { delay: 0, duration: 0.22 },
    stroke: { delay: 0.18, duration: 0.26 },
    wash: { delay: 0.18, duration: 0.26 },
    blur: { delay: 0.18, duration: 0.26 },
  },
} as const;

/** Grid search — GSAP transition draw, title last. */
const BAND_TIMELINE = {
  enter: {
    stroke: { delayPerIndex: 0, duration: 0.6 },
    overlay: { delay: 0.66, duration: 0.22 },
  },
  leave: {
    overlay: { delay: 0, duration: 0.25 },
    stroke: { delay: 0, duration: 0.25 },
  },
  reduced: { duration: 0.2 },
} as const;

type StandardBrushTimeline =
  | typeof TIMELINE
  | typeof PAINT_OVER_TIMELINE
  | typeof LITE_TIMELINE
  | typeof GLAZE_TIMELINE;

type TimelineMode = StandardBrushTimeline | typeof BAND_TIMELINE;

function pickStandardTimeline(
  paintOver: boolean,
  lite = false,
  glazeMode = false,
): StandardBrushTimeline {
  if (lite) return LITE_TIMELINE;
  if (glazeMode) return GLAZE_TIMELINE;
  return paintOver ? PAINT_OVER_TIMELINE : TIMELINE;
}

function pickTimeline(
  paintOver: boolean,
  lite = false,
  glazeMode = false,
  wedgeMode = false,
): TimelineMode {
  if (wedgeMode) return BAND_TIMELINE;
  return pickStandardTimeline(paintOver, lite, glazeMode);
}

/** Unified opacity fade for prefers-reduced-motion (~0.2s, no blur/stroke ramp). */
export const brushReducedTransition = (): Transition => ({
  duration: TIMELINE.reduced.duration,
  ease: POWER3_OUT,
});

/** Palette wash — enters with blur; exits last on leave. */
export const brushWashTransition = (
  active: boolean,
  reduced: boolean,
  paintOver = false,
  lite = false,
  glazeMode = false,
  _wedgeMode = false,
): Transition => {
  if (reduced) return brushReducedTransition();
  const timeline = pickStandardTimeline(paintOver, lite, glazeMode);
  const t = active ? timeline.enter.wash : timeline.leave.wash;
  return {
    delay: t.delay,
    duration: t.duration,
    ease: active ? POWER1_OUT : POWER2_OUT,
  };
};

/** Grid band — overlay fade synced with path draw / leave. */
export const brushBandBloomTransition = (
  index: number,
  active: boolean,
  reduced: boolean,
  lite = false,
): Transition => {
  if (reduced) {
    return {
      delay: 0,
      duration: BAND_TIMELINE.reduced.duration,
      ease: POWER3_OUT,
    };
  }
  if (!active) {
    return {
      delay: BAND_TIMELINE.leave.stroke.delay,
      duration: BAND_TIMELINE.leave.stroke.duration,
      ease: POWER2_OUT,
    };
  }
  const drawDuration = lite ? 0.5 : BAND_TIMELINE.enter.stroke.duration;
  const delay = index >= 2 ? drawDuration + 0.06 : 0;
  return {
    delay,
    duration: BAND_TIMELINE.enter.overlay.duration,
    ease: POWER3_OUT,
  };
};

/** @deprecated Band mode no longer uses a dim overlay. */
export const brushBandDimTransition = (active: boolean, reduced: boolean): Transition =>
  brushBandBloomTransition(0, active, reduced);

/** Metadata overlay base delay (seconds) — content stagger starts after this. */
export function brushOverlayEnterDelay(
  paintOver = false,
  lite = false,
  glazeMode = false,
  smearPassCount?: number,
  wedgeMode = false,
): number {
  if (wedgeMode && smearPassCount !== undefined) {
    return brushBandOverlayEnterDelay(lite);
  }
  if (glazeMode && smearPassCount !== undefined) {
    return brushGlazeOverlayEnterDelay(smearPassCount, lite);
  }
  return pickTimeline(paintOver, lite, glazeMode, wedgeMode).enter.overlay.delay;
}

/** Grid band — title appears after paths finish drawing. */
export function brushBandOverlayEnterDelay(lite = false): number {
  const duration = lite ? 0.5 : BAND_TIMELINE.enter.stroke.duration;
  return duration + 0.06;
}

/** Glaze smear — metadata appears after the last pass lands. */
export function brushGlazeOverlayEnterDelay(passCount: number, lite = false): number {
  const delayPerIndex = lite ? 0.08 : GLAZE_TIMELINE.enter.stroke.delayPerIndex;
  const duration = lite ? 0.58 : GLAZE_TIMELINE.enter.stroke.duration;
  const lastPassStart = Math.max(0, passCount - 1) * delayPerIndex;
  return lastPassStart + duration * 0.72;
}

/** CSS loaded-tip smear pass timing (masonry glaze). */
export const brushSmearTransition = (
  index: number,
  active: boolean,
  reduced: boolean,
  lite = false,
): Transition => {
  if (reduced) return brushReducedTransition();
  const delayPerIndex = lite ? 0.08 : GLAZE_TIMELINE.enter.stroke.delayPerIndex;
  const duration = lite ? 0.58 : GLAZE_TIMELINE.enter.stroke.duration;

  if (active) {
    return {
      delay: index * delayPerIndex,
      duration,
      ease: POWER1_IN_OUT,
    };
  }

  return {
    delay: GLAZE_TIMELINE.leave.stroke.delay,
    duration: GLAZE_TIMELINE.leave.stroke.duration,
    ease: POWER2_OUT,
  };
};

/** NSFW card hover — metadata only; no stroke-sync delay. */
const NSFW_METADATA_TIMELINE = {
  enter: {
    scrim: { delay: 0.1, duration: 0.22 },
    overlay: { delay: 0.12, duration: 0.2 },
  },
  leave: {
    scrim: { delay: 0, duration: 0.18 },
    overlay: { delay: 0, duration: 0.18 },
  },
} as const;

/** Metadata overlay base delay for mature-content cards (seconds). */
export function brushNsfwOverlayEnterDelay(reduced: boolean): number {
  if (reduced) return 0;
  return NSFW_METADATA_TIMELINE.enter.overlay.delay;
}

/** Bottom scrim for NSFW metadata — quick fade, no glaze dim. */
export const brushNsfwScrimTransition = (active: boolean, reduced: boolean): Transition => {
  if (reduced) return brushReducedTransition();
  const t = active ? NSFW_METADATA_TIMELINE.enter.scrim : NSFW_METADATA_TIMELINE.leave.scrim;
  return {
    delay: t.delay,
    duration: t.duration,
    ease: active ? POWER3_OUT : POWER2_IN,
  };
};

/** Per-chip fade for NSFW metadata overlay. */
export const brushNsfwOverlayItemTransition = (active: boolean, reduced: boolean): Transition => {
  if (reduced) return brushReducedTransition();
  const duration = active
    ? NSFW_METADATA_TIMELINE.enter.overlay.duration
    : NSFW_METADATA_TIMELINE.leave.overlay.duration;
  return {
    duration,
    ease: active ? POWER3_OUT : POWER2_IN,
  };
};

export const BRUSH_OVERLAY_GROUP_STAGGER = 0.1;
export const BRUSH_OVERLAY_ITEM_STAGGER = 0.055;

/** Per-chip / metadata item inside the overlay. */
export const brushOverlayItemTransition = (active: boolean, reduced: boolean): Transition => {
  if (reduced) return brushReducedTransition();
  return {
    duration: active ? 0.32 : 0.24,
    ease: active ? POWER3_OUT : POWER2_IN,
  };
};

/** Metadata overlay — enters last; exits first on leave. */
export const brushOverlayTransition = (
  active: boolean,
  reduced: boolean,
  paintOver = false,
): Transition => {
  if (reduced) return brushReducedTransition();
  const timeline = pickTimeline(paintOver);
  const t = active ? timeline.enter.overlay : timeline.leave.overlay;
  return {
    delay: t.delay,
    duration: t.duration,
    ease: active ? POWER3_OUT : POWER2_IN,
  };
};

/** SVG stroke draw — staggered enter; reverse stagger on leave. */
export const brushStrokeTransition = (
  index: number,
  active: boolean,
  reduced: boolean,
  layerCount = BRUSH_DEFAULT_LAYER_COUNT,
  paintOver = false,
  lite = false,
  glazeMode = false,
  wedgeMode = false,
): Transition => {
  if (reduced) return brushReducedTransition();
  const timeline = pickTimeline(paintOver, lite, glazeMode, wedgeMode);
  if (active) {
    const strokeEnter = timeline.enter.stroke;
    const delay = 'delayPerIndex' in strokeEnter ? index * strokeEnter.delayPerIndex : 0;
    return {
      delay,
      duration: strokeEnter.duration,
      ease: POWER1_IN_OUT,
    };
  }
  if (glazeMode) {
    const strokeLeave = timeline.leave.stroke;
    if ('delay' in strokeLeave) {
      return {
        delay: strokeLeave.delay,
        duration: strokeLeave.duration,
        ease: POWER2_OUT,
      };
    }
  }
  if (wedgeMode) {
    const strokeLeave = BAND_TIMELINE.leave.stroke;
    return {
      delay: strokeLeave.delay,
      duration: strokeLeave.duration,
      ease: POWER2_OUT,
    };
  }
  const reverseIndex = Math.max(0, layerCount - 1 - index);
  const strokeLeave = timeline.leave.stroke;
  if (!('delayPerReverseIndex' in strokeLeave)) {
    return { delay: 0, duration: 0.26, ease: POWER2_OUT };
  }
  return {
    delay: reverseIndex * strokeLeave.delayPerReverseIndex,
    duration: strokeLeave.duration,
    ease: POWER1_IN_OUT,
  };
};

/** Artwork blur — synced with wash timing (skipped when solidFill). */
export const brushImageBlurTransition = (
  active: boolean,
  reduced: boolean,
  paintOver = false,
): Transition => {
  if (reduced) return brushReducedTransition();
  const timeline = pickStandardTimeline(paintOver);
  const t = active ? timeline.enter.blur : timeline.leave.blur;
  return {
    delay: t.delay,
    duration: t.duration,
    ease: active ? POWER1_OUT : POWER2_OUT,
  };
};

/** Artwork fade-out under solid paint-over. */
export const brushImageFadeTransition = (active: boolean, reduced: boolean): Transition => {
  if (reduced) return brushReducedTransition();
  const t = active ? PAINT_OVER_TIMELINE.enter.imageFade : PAINT_OVER_TIMELINE.leave.imageFade;
  return {
    delay: t.delay,
    duration: t.duration,
    ease: active ? POWER2_OUT : POWER1_OUT,
  };
};
