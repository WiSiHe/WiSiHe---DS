'use client';

import { motion } from 'motion/react';

interface TechnicalNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
}

export function TechnicalNavigation({
  onPrevious,
  onNext,
  isFirstSlide,
  isLastSlide,
}: TechnicalNavigationProps) {
  return (
    <div className='absolute bottom-8 right-8 z-50 flex gap-4'>
      <motion.button
        onClick={onPrevious}
        disabled={isFirstSlide}
        type='button'
        whileHover={!isFirstSlide ? { scale: 1.05 } : {}}
        whileTap={!isFirstSlide ? { scale: 0.95 } : {}}
        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isFirstSlide
            ? 'bg-surface border border-border text-foreground/30 cursor-not-allowed'
            : 'bg-surface text-foreground border-2 border-border hover:border-accent-border hover:bg-surface-hover transition-colors'
        }`}
        aria-label='Previous slide'
        aria-disabled={isFirstSlide}
      >
        <span aria-hidden='true'>←</span> Previous
      </motion.button>
      <motion.button
        onClick={onNext}
        disabled={isLastSlide}
        type='button'
        whileHover={!isLastSlide ? { scale: 1.05 } : {}}
        whileTap={!isLastSlide ? { scale: 0.95 } : {}}
        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isLastSlide
            ? 'bg-surface border border-border text-foreground/30 cursor-not-allowed'
            : 'bg-accent text-accent-contrast hover:bg-accent-hover shadow-lg shadow-accent/30'
        }`}
        aria-label='Next slide'
        aria-disabled={isLastSlide}
      >
        Next <span aria-hidden='true'>→</span>
      </motion.button>
    </div>
  );
}
