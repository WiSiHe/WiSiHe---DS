'use client';

import { motion } from 'motion/react';

type PresentationControlsProps = Readonly<{
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onScrollToTop: () => void;
  onSkipToCoolPart: () => void;
  isVisible: boolean;
}>;

export function PresentationControls({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onScrollToTop,
  onSkipToCoolPart,
  isVisible,
}: PresentationControlsProps) {
  if (!isVisible) return null;

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3 md:gap-4 pointer-events-none">
      {/* Navigation Group */}
      <div className="pointer-events-auto flex flex-col items-center bg-surface-elevated border border-border rounded-2xl p-1.5 shadow-xl overflow-hidden">
        <motion.button
          onClick={onPrev}
          disabled={isFirstSlide}
          whileHover={isFirstSlide ? {} : { backgroundColor: 'var(--color-surface-active)' }}
          whileTap={isFirstSlide ? {} : { scale: 0.95 }}
          className={`w-12 h-12 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors touch-manipulation ${
            isFirstSlide
              ? 'text-foreground/20 cursor-not-allowed'
              : 'text-foreground hover:text-accent cursor-pointer'
          }`}
          aria-label="Previous slide"
          style={{ touchAction: 'manipulation' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>

        <div className="py-2 text-[10px] font-mono font-medium text-foreground/50 select-none">
          {String(currentSlide + 1).padStart(2, '0')}
          <span className="opacity-30">/</span>
          {String(totalSlides).padStart(2, '0')}
        </div>

        <motion.button
          onClick={onNext}
          disabled={isLastSlide}
          whileHover={isLastSlide ? {} : { backgroundColor: 'var(--color-surface-active)' }}
          whileTap={isLastSlide ? {} : { scale: 0.95 }}
          className={`w-12 h-12 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors touch-manipulation ${
            isLastSlide
              ? 'text-foreground/20 cursor-not-allowed'
              : 'text-foreground hover:text-accent cursor-pointer'
          }`}
          aria-label="Next slide"
          style={{ touchAction: 'manipulation' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.button>
      </div>

      {/* Actions Group */}
      <div className="flex flex-col gap-2 md:gap-3 items-end pointer-events-auto">
        {/* Skip to Cool Part Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSkipToCoolPart}
          className="group flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-2 bg-surface-elevated border border-border rounded-xl shadow-lg hover:shadow-xl hover:bg-surface-active transition-all cursor-pointer touch-manipulation min-h-[44px] md:min-h-0"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="p-1 rounded-full bg-surface group-hover:bg-accent/20 transition-colors">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:text-accent transition-colors"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover:text-foreground hidden sm:inline">
            Skip to Cool Part
          </span>
        </motion.button>

        {/* Scroll to Top Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onScrollToTop}
          className="group flex items-center gap-2 px-3 md:px-4 py-2.5 bg-surface-elevated border border-border rounded-xl shadow-lg hover:shadow-xl hover:bg-surface-active transition-all cursor-pointer touch-manipulation min-h-[44px] md:min-h-0"
          aria-label="Scroll to top"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="p-1.5 rounded-full bg-surface group-hover:bg-accent/20 transition-colors flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:text-accent transition-colors"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </div>
          <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
            Scroll to Top
          </span>
        </motion.button>
      </div>
    </div>
  );
}
