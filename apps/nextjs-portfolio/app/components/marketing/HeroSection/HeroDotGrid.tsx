'use client';

import { motion, useReducedMotion } from 'motion/react';

const DOT_MASK = 'radial-gradient(ellipse 60% 48% at 50% 46%, transparent 0%, black 78%)';

const dotLayerStyle = {
  backgroundImage: 'radial-gradient(var(--color-foreground) 1.5px, transparent 1.5px)',
  backgroundSize: '36px 36px',
  maskImage: DOT_MASK,
  WebkitMaskImage: DOT_MASK,
} as const;

/** Static opacity when motion is off or for reduced-motion users. */
const DOT_OPACITY = 0.28;

/**
 * Hero background dot field — edge-weighted mask, barely-there opacity breathe.
 */
export function HeroDotGrid() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className='absolute inset-0 pointer-events-none animate-fade-in'
        style={{ ...dotLayerStyle, opacity: DOT_OPACITY }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className='absolute inset-0 pointer-events-none animate-fade-in'
      style={dotLayerStyle}
      aria-hidden
      animate={{ opacity: [0.24, 0.31, 0.24] }}
      transition={{
        duration: 14,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );
}
