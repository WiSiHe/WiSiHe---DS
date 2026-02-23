'use client';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { TechnicalSlideIndicators } from './TechnicalSlideIndicators';

interface TechnicalSlideHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onSlideClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function TechnicalSlideHeader({
  currentSlide,
  totalSlides,
  onSlideClick,
  onNext,
  onPrev,
}: TechnicalSlideHeaderProps) {
  return (
    <header className='w-full pt-16 lg:pt-10 pb-8 lg:pl-32 lg:pr-4 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700'>
      {/* Navigation Row */}
      <div className='flex items-center justify-between gap-8 max-w-5xl'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className='p-2 -ml-2 rounded-full hover:bg-surface-elevated disabled:opacity-0 transition-all text-foreground/40 hover:text-accent active:scale-90'
            aria-label='Previous Slide'
          >
            <HiChevronLeft className='h-6 w-6' />
          </button>

          <div className='flex flex-col'>
            <span className='text-[10px] font-black uppercase tracking-[0.3em] text-accent/50 leading-none mb-1.5'>
              Technical Slide
            </span>
            <span className='text-xs font-mono text-foreground/40 tabular-nums'>
              {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        </div>

        <TechnicalSlideIndicators
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onSlideClick={onSlideClick}
        />

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className='p-2 -mr-2 rounded-full hover:bg-surface-elevated disabled:opacity-0 transition-all text-foreground/40 hover:text-accent active:scale-90'
          aria-label='Next Slide'
        >
          <HiChevronRight className='h-6 w-6' />
        </button>
      </div>

      <div className='h-px w-full bg-linear-to-r from-border/50 via-border/10 to-transparent' />
    </header>
  );
}
