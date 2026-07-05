'use client';

import {
  MOTION_REVEAL_X,
  MOTION_REVEAL_Y,
  SECTION_REVEAL_DURATION,
  SECTION_REVEAL_VIEWPORT,
  sectionRevealTransition,
} from '@wisihe/ui-react/motion';
import { useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useState } from 'react';
import { SECTION_REVEAL_EASE } from '@/lib/motion/motionTokens';

export {
  headerStaggerContainerVariants,
  MOTION_EASE_OUT,
  MOTION_REVEAL_X,
  MOTION_REVEAL_Y,
  SECTION_REVEAL_DURATION,
  SECTION_REVEAL_VIEWPORT,
  sectionRevealTransition,
  staggerFadeUpItemVariants,
} from '@wisihe/ui-react/motion';

export { SECTION_REVEAL_EASE } from '@/lib/motion/motionTokens';

export function useSectionReveal() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && Boolean(prefersReducedMotion);
  const transition = sectionRevealTransition(reducedMotion);

  return {
    reducedMotion,
    mounted,
    viewport: SECTION_REVEAL_VIEWPORT,
    transition,
    fadeUpInitial: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: MOTION_REVEAL_Y },
    fadeUpAnimate: { opacity: 1, y: 0 },
    slideInRightInitial: reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: MOTION_REVEAL_X },
    slideInRightAnimate: { opacity: 1, x: 0 },
    horizontalSlideInitial: reducedMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: MOTION_REVEAL_X },
    horizontalSlideAnimate: { opacity: 1, x: 0 },
    playerEmergenceInitial: reducedMotion
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 24, scale: 0.97 },
    playerEmergenceAnimate: { opacity: 1, y: 0, scale: 1 },
  };
}

export function staggerContainerVariants(reducedMotion: boolean, stagger = 0.08): Variants {
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

export function staggerSlideRightItemVariants(reducedMotion: boolean): Variants {
  return {
    hidden: reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: MOTION_REVEAL_X },
    visible: {
      opacity: 1,
      x: 0,
      transition: reducedMotion
        ? { duration: 0 }
        : { duration: SECTION_REVEAL_DURATION, ease: SECTION_REVEAL_EASE },
    },
  };
}

export function printLandingItemVariants(
  finalRotationDeg: number,
  reducedMotion: boolean,
): Variants {
  return {
    hidden: reducedMotion
      ? { opacity: 1, scale: 1, rotate: finalRotationDeg }
      : { opacity: 0, scale: 0.94, rotate: finalRotationDeg * 1.2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: finalRotationDeg,
      transition: reducedMotion ? { duration: 0 } : { duration: 0.6, ease: SECTION_REVEAL_EASE },
    },
  };
}

export function skillsSpringItemVariants(reducedMotion: boolean): Variants {
  return {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: MOTION_REVEAL_Y },
    visible: reducedMotion
      ? { opacity: 1, y: 0 }
      : {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 150,
            damping: 20,
          },
        },
  };
}

export function skillsContainerVariants(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reducedMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
    },
  };
}
