'use client';

import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '../../../three-d/types';

interface TitleSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate?: boolean;
  slideDirection?: 'up' | 'down';
}

export const TitleSlide = ({
  slideData,
  index,
  shouldAnimate,
  slideDirection,
}: TitleSlideProps) => {
  const slideDesign = slideData.slideDesign || 'default';
  
  const getTitleClasses = () => {
    switch (slideDesign) {
      case 'minimal':
        return 'text-4xl md:text-6xl lg:text-7xl';
      case 'hero':
        return 'text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] 2xl:text-[14rem]';
      default:
        return 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem]';
    }
  };

  const showDecorations = slideDesign !== 'minimal';
  const isHero = slideDesign === 'hero';

  return (
    <div
      className={cn(
        'text-center space-y-8 relative w-full',
        slideDesign === 'minimal' ? 'py-12 md:py-16 lg:py-20' : isHero ? 'py-12 md:py-16 lg:py-24' : 'py-12 md:py-16 lg:py-24'
      )}
    >
      {/* Decorative elements */}
      {showDecorations && (
        <>
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl',
              isHero ? 'w-[600px] h-[600px] bg-accent/10' : 'w-96 h-96 bg-accent/5'
            )}
          />
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full blur-3xl',
              isHero ? 'w-96 h-96 bg-accent/10' : 'w-64 h-64 bg-accent/5'
            )}
          />
        </>
      )}

      <div className="inline-flex items-center gap-3 mb-12 relative z-10 px-4 py-2.5 bg-surface-elevated/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg">
        <span className="px-4 py-1.5 text-xs font-mono text-foreground/60 uppercase tracking-wider">
          PRESENTATION
        </span>
        {slideData.category && (
          <>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span className="px-4 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
              {slideData.category}
            </span>
          </>
        )}
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className={cn(getTitleClasses(), 'font-black mb-8 md:mb-10 text-foreground uppercase leading-[1.1] tracking-tight px-4 break-words overflow-wrap-anywhere')} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
          <span className="block mb-4 md:mb-6 text-foreground">
            {slideData.title.split(':')[0]}
          </span>
          {slideData.title.includes(':') && (
            <span className="block text-4xl md:text-5xl lg:text-6xl text-accent mt-4 md:mt-6">
              {slideData.title.split(':').slice(1).join(':')}
            </span>
          )}
        </h1>
        {slideData.subtitle && (
          <div>
            <p className="text-2xl md:text-4xl lg:text-5xl text-foreground/80 font-bold leading-relaxed mt-8 md:mt-12 break-words overflow-wrap-anywhere" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {slideData.subtitle}
            </p>
            {showDecorations && (
              <div className="flex justify-center gap-2 mt-12 md:mt-16">
                <div className="h-1 w-16 bg-accent rounded-full" />
                <div className="h-1 w-8 bg-accent/50 rounded-full" />
                <div className="h-1 w-4 bg-accent/30 rounded-full" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

