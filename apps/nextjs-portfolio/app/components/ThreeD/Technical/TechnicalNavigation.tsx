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
    <div className="absolute bottom-8 right-8 z-50 flex gap-4">
      <motion.button
        onClick={onPrevious}
        disabled={isFirstSlide}
        type="button"
        whileHover={!isFirstSlide ? { scale: 1.05 } : {}}
        whileTap={!isFirstSlide ? { scale: 0.95 } : {}}
        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
          isFirstSlide
            ? 'bg-surface-elevated/90 text-foreground/30 cursor-not-allowed'
            : 'bg-surface-elevated/90 text-foreground border-2 border-border/50 hover:border-accent/50 hover:bg-surface/90'
        }`}
        aria-label="Previous slide"
      >
        <span aria-hidden="true">←</span> Previous
      </motion.button>
      <motion.button
        onClick={onNext}
        disabled={isLastSlide}
        type="button"
        whileHover={!isLastSlide ? { scale: 1.05 } : {}}
        whileTap={!isLastSlide ? { scale: 0.95 } : {}}
        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
          isLastSlide
            ? 'bg-surface-elevated/90 text-foreground/30 cursor-not-allowed'
            : 'bg-accent/90 text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/30'
        }`}
        aria-label="Next slide"
      >
        Next <span aria-hidden="true">→</span>
      </motion.button>
    </div>
  );
}
