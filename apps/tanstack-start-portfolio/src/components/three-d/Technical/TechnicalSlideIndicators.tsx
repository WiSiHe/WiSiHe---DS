'use client';

import { cn } from '@wisihe/utils';
import { motion } from 'motion/react';

interface TechnicalSlideIndicatorsProps {
  currentSlide: number;
  totalSlides: number;
  onSlideClick?: (index: number) => void;
}

export function TechnicalSlideIndicators({
  currentSlide,
  totalSlides,
  onSlideClick,
}: TechnicalSlideIndicatorsProps) {
  return (
    <div className='flex gap-1 w-full max-w-2xl mx-auto h-1.5 group/nav'>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;
        const isPast = index < currentSlide;

        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: indicators are generated from a count; the index is their identity
            key={index}
            onClick={() => onSlideClick?.(index)}
            type='button'
            className='relative flex-1 h-full focus:outline-hidden'
            aria-label={`Go to slide ${index + 1} of ${totalSlides}`}
          >
            {/* Background Track */}
            <div
              className={cn(
                'absolute inset-0 rounded-sm transition-colors duration-300 hover:bg-accent/40',
                isPast ? 'bg-foreground opacity-25' : 'bg-foreground opacity-10',
              )}
            />

            {/* Active Highlight */}
            {isActive && (
              <motion.div
                layoutId='active-indicator-track'
                className='absolute inset-0 bg-accent rounded-sm shadow-[0_0_8px_rgba(var(--color-accent-rgb),0.4)]'
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            {/* Extended Hit Area */}
            <div className='absolute -inset-y-3 inset-x-0 cursor-pointer z-10' />

            {/* Active indicator dot on hover */}
            <div className='absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <motion.div
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors hover:bg-accent',
                  isActive ? 'bg-accent' : 'bg-foreground',
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
