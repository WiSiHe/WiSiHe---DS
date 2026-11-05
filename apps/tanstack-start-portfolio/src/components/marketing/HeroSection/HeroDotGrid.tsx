'use client';

import { useHydrationSafeReducedMotion } from '@wisihe/ui-react';
import { motion } from 'motion/react';

/**
 * Hero background — radial wash + edge-weighted dot field (masked clear at center).
 * Dot colors live in globals.css (explicit rgba) — not inline gradients.
 */
export function HeroDotGrid() {
  const reduceMotion = useHydrationSafeReducedMotion();

  return (
    <div className='hero-dot-grid pointer-events-none absolute inset-0 overflow-hidden' aria-hidden>
      <div className='hero-dot-grid__wash' />

      {reduceMotion ? (
        <div className='hero-dot-grid__dots' />
      ) : (
        <motion.div
          className='hero-dot-grid__dots'
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{
            duration: 14,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      )}
    </div>
  );
}
