'use client';

import { TechnicalSlideIndicators } from './TechnicalSlideIndicators';

interface TechnicalSlideHeaderProps {
  currentSlide: number;
  totalSlides: number;
  title: string;
  onSlideClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function TechnicalSlideHeader({
  currentSlide,
  totalSlides,
  title,
  onSlideClick,
  onNext,
  onPrev,
}: TechnicalSlideHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-16 md:pt-24 lg:pt-28 xl:pt-32 pb-6 md:pb-8 px-4">
      <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3 md:gap-4 lg:gap-6">
        <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md shadow-sm shadow-accent/5 hover:shadow-md hover:shadow-accent/10 transition-all duration-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent shadow-sm shadow-accent/50"></span>
          </span>
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            Technical Deep Dive &middot; {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="p-3 md:p-2.5 lg:p-3 rounded-full bg-surface-elevated/50 hover:bg-surface-elevated border border-border/50 hover:border-accent/30 disabled:opacity-30 disabled:hover:bg-surface-elevated/50 disabled:hover:border-border/50 disabled:cursor-not-allowed transition-all duration-200 text-foreground hover:text-accent hover:shadow-md hover:shadow-accent/10 active:scale-95 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
            aria-label="Previous Slide"
            style={{ touchAction: 'manipulation' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <TechnicalSlideIndicators
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onSlideClick={onSlideClick}
          />

          <button
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            className="p-3 md:p-2.5 lg:p-3 rounded-full bg-surface-elevated/50 hover:bg-surface-elevated border border-border/50 hover:border-accent/30 disabled:opacity-30 disabled:hover:bg-surface-elevated/50 disabled:hover:border-border/50 disabled:cursor-not-allowed transition-all duration-200 text-foreground hover:text-accent hover:shadow-md hover:shadow-accent/10 active:scale-95 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
            aria-label="Next Slide"
            style={{ touchAction: 'manipulation' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mt-4 md:mt-6 lg:mt-8">
        {title}
      </h2>
    </div>
  );
}
