/** Shared easing for section reveal animations. */
export const MOTION_EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const MOTION_REVEAL_Y = 20;
export const MOTION_REVEAL_X = 32;

export const SECTION_REVEAL_VIEWPORT = {
  once: true,
  margin: '-10% 0px -8% 0px',
} as const;

export const SECTION_REVEAL_DURATION = 0.55;

export function sectionRevealTransition(reducedMotion: boolean) {
  return reducedMotion
    ? { duration: 0 }
    : { duration: SECTION_REVEAL_DURATION, ease: MOTION_EASE_OUT };
}

export function headerStaggerContainerVariants(reducedMotion: boolean, stagger = 0.07) {
  return {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reducedMotion
        ? { duration: 0 }
        : { staggerChildren: stagger, delayChildren: 0.1 },
    },
  };
}

export function staggerFadeUpItemVariants(reducedMotion: boolean) {
  return {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: MOTION_REVEAL_Y },
    visible: {
      opacity: 1,
      y: 0,
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: SECTION_REVEAL_DURATION, ease: MOTION_EASE_OUT },
    },
  };
}
