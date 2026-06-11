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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='pointer-events-none absolute bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3'
          aria-hidden
        >
          <span className='text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-semibold select-none'>
            Scroll
          </span>
          <div className='relative flex h-16 w-[1px] items-start justify-center overflow-hidden bg-foreground/10'>
            <motion.div
              className='h-1/2 w-full bg-accent shadow-[0_0_12px_var(--color-accent)]'
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: ['-100%', '200%'],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
