'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { JourneyCityCard } from './JourneyCityCard';
import type { LifeJourneyItem } from './lifeJourneyTypes';

type JourneyMobileCarouselProps = {
  item: LifeJourneyItem | null;
  displayIndex: number;
  total: number;
};

export function JourneyMobileCarousel({ item, displayIndex, total }: JourneyMobileCarouselProps) {
  const reduceMotion = useReducedMotion();

  if (!item) return null;

  return (
    <section
      className='mt-4 lg:hidden'
      aria-live='polite'
      aria-atomic='true'
      aria-label='City details'
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={item._key}
          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        >
          <JourneyCityCard item={item} index={displayIndex} total={total} isActive />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
