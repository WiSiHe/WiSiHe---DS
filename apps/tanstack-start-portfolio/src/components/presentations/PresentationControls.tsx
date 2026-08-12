'use client';

import { IconArrowUp, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';

type PresentationControlsProps = Readonly<{
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onScrollToTop: () => void;
  isVisible: boolean;
}>;

export function PresentationControls({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onScrollToTop,
  isVisible,
}: PresentationControlsProps) {
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  return (
    <AnimatePresence>
      {isVisible ? (
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
          className='pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3 md:right-10 md:bottom-10 md:gap-4'
        >
          <div className='pointer-events-auto flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-surface-elevated p-1 shadow-2xl ring-1 ring-border/50'>
            <motion.button
              type='button'
              onClick={onPrev}
              disabled={isFirstSlide}
              whileHover={
                isFirstSlide ? {} : { backgroundColor: 'rgba(var(--color-foreground-rgb), 0.05)' }
              }
              whileTap={isFirstSlide ? {} : { scale: 0.92 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 md:h-12 md:w-12 ${
                isFirstSlide
                  ? 'cursor-not-allowed text-foreground/10'
                  : 'cursor-pointer text-foreground/60 hover:text-accent'
              }`}
              aria-label='Previous slide'
            >
              <IconChevronUp className='size-6' stroke={2} aria-hidden />
            </motion.button>

            <div className='flex w-full flex-col items-center gap-0.5 border-y border-border/10 bg-foreground/5 py-1.5 select-none'>
              <span className='text-[10px] leading-none font-black text-foreground antialiased'>
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <div className='h-px w-4 bg-foreground/20' />
              <span className='text-[9px] leading-none font-bold text-foreground/40 antialiased'>
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            <motion.button
              type='button'
              onClick={onNext}
              disabled={isLastSlide}
              whileHover={
                isLastSlide ? {} : { backgroundColor: 'rgba(var(--color-foreground-rgb), 0.05)' }
              }
              whileTap={isLastSlide ? {} : { scale: 0.92 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 md:h-12 md:w-12 ${
                isLastSlide
                  ? 'cursor-not-allowed text-foreground/10'
                  : 'cursor-pointer text-foreground/60 hover:text-accent'
              }`}
              aria-label='Next slide'
            >
              <IconChevronDown className='size-6' stroke={2} aria-hidden />
            </motion.button>
          </div>

          <motion.button
            type='button'
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScrollToTop}
            className='group pointer-events-auto flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2 shadow-xl ring-1 ring-border/50 transition-all duration-300 hover:shadow-black/5'
            aria-label='Scroll to top'
          >
            <span className='pl-1 font-mono text-xs font-bold tracking-wider text-foreground/60 uppercase transition-colors group-hover:text-foreground'>
              TOP
            </span>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/5 transition-all duration-300 group-hover:bg-foreground group-hover:text-background'>
              <IconArrowUp className='size-5' stroke={2} aria-hidden />
            </div>
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
