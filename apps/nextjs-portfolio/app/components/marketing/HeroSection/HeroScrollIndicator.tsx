'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type HeroScrollIndicatorProps = {
  show: boolean;
};

/**
 * Decorative “scroll for more” hint above the fixed bottom nav (see HeaderNavigation).
 */
export default function HeroScrollIndicator({ show }: HeroScrollIndicatorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key='hero-scroll-indicator'
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className='pointer-events-none absolute bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center'
          aria-hidden
        >
          <motion.div
            className='relative'
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -6, 0],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            <div aria-hidden className='pointer-events-none absolute inset-0 rounded-2xl' />

            <div className='relative flex h-11 w-7 items-start justify-center overflow-hidden rounded-full border-2 border-foreground/55 bg-linear-to-b from-foreground/6 to-transparent p-2 dark:border-foreground/70'>
              <motion.div
                className='h-2 w-2 rounded-full bg-linear-to-b from-accent to-accent/70 shadow-[0_0_10px_var(--color-accent)]'
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, 14, 0],
                        opacity: [1, 0.45, 1],
                        scale: [1, 0.9, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: [0.45, 0, 0.55, 1],
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
