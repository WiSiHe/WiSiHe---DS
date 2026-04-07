'use client';

import { AnimatePresence, motion } from 'motion/react';
import { HiArrowSmallUp, HiChevronDown, HiChevronUp, HiRocketLaunch } from 'react-icons/hi2';

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
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            opacity: { duration: 0.2 },
          }}
          className='fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-3 md:gap-4 pointer-events-none'
        >
          {/* Navigation Group - Minimal Vertical Toolbar */}
          <div className='pointer-events-auto flex flex-col items-center bg-surface-elevated border border-border rounded-2xl p-1 shadow-2xl overflow-hidden ring-1 ring-border/50'>
            <motion.button
              onClick={onPrev}
              disabled={isFirstSlide}
              whileHover={
                isFirstSlide ? {} : { backgroundColor: 'rgba(var(--color-foreground-rgb), 0.05)' }
              }
              whileTap={isFirstSlide ? {} : { scale: 0.92 }}
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isFirstSlide
                  ? 'text-foreground/10 cursor-not-allowed'
                  : 'text-foreground/60 hover:text-accent cursor-pointer'
              }`}
              aria-label='Previous slide'
            >
              <HiChevronUp className='w-6 h-6' />
            </motion.button>

            <div className='py-1.5 flex flex-col items-center gap-0.5 select-none border-y border-border/10 w-full bg-foreground/5'>
              <span className='text-[10px] font-black text-foreground antialiased leading-none'>
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <div className='w-4 h-[1px] bg-foreground/20' />
              <span className='text-[9px] font-bold text-foreground/40 antialiased leading-none'>
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            <motion.button
              onClick={onNext}
              disabled={isLastSlide}
              whileHover={
                isLastSlide ? {} : { backgroundColor: 'rgba(var(--color-foreground-rgb), 0.05)' }
              }
              whileTap={isLastSlide ? {} : { scale: 0.92 }}
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isLastSlide
                  ? 'text-foreground/10 cursor-not-allowed'
                  : 'text-foreground/60 hover:text-accent cursor-pointer'
              }`}
              aria-label='Next slide'
            >
              <HiChevronDown className='w-6 h-6' />
            </motion.button>
          </div>

          {/* Actions Group - Horizontal Label Buttons */}
          <div className='flex flex-col gap-2.5 items-end pointer-events-auto'>
            {/* Skip to Cool Part Button */}
            <motion.button
              whileHover={{ scale: 1.02, x: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSkipToCoolPart}
              className='group flex items-center gap-3 px-4 py-2 bg-surface border border-border rounded-2xl shadow-xl hover:shadow-accent/10 hover:border-accent-border transition-all duration-300 ring-1 ring-border/50'
            >
              <span className='text-xs font-bold text-foreground/60 group-hover:text-accent transition-colors uppercase tracking-wider pl-1'>
                Skip to Cool Part
              </span>
              <div className='w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-contrast transition-all duration-300 shadow-inner'>
                <HiRocketLaunch className='w-4 h-4' />
              </div>
            </motion.button>

            {/* Scroll to Top Button */}
            <motion.button
              whileHover={{ scale: 1.02, x: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onScrollToTop}
              className='group flex items-center gap-3 px-4 py-2 bg-surface border border-border rounded-2xl shadow-xl hover:shadow-black/5 transition-all duration-300 ring-1 ring-border/50'
              aria-label='Scroll to top'
            >
              <span className='text-xs font-bold text-foreground/60 group-hover:text-foreground transition-colors uppercase tracking-wider pl-1 font-mono'>
                TOP
              </span>
              <div className='w-8 h-8 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300'>
                <HiArrowSmallUp className='w-5 h-5' />
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
