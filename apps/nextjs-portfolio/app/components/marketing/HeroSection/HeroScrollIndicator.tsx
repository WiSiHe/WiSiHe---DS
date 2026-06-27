'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type HeroScrollIndicatorProps = {
  show: boolean;
};

/**
 * Icon-only scroll hint above the fixed bottom nav (see HeaderNavigation).
 */
export default function HeroScrollIndicator({ show }: HeroScrollIndicatorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key='hero-scroll-indicator'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='pointer-events-none absolute bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-foreground/35'
          aria-hidden
        >
          <motion.div
            className='flex flex-col items-center -space-y-4'
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, 5, 0],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <IconChevronDown className='size-5 stroke-[1.75]' aria-hidden />
            <IconChevronDown className='size-5 stroke-[1.75] opacity-50' aria-hidden />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
