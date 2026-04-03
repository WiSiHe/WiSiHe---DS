'use client';

import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '../../../three-d/types';

interface SeparatorSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate?: boolean;
  slideDirection?: 'up' | 'down';
}

export const SeparatorSlide = ({
  slideData,
  index: _index,
  shouldAnimate: _shouldAnimate,
  slideDirection: _slideDirection,
}: SeparatorSlideProps) => {
  const design = slideData.slideDesign || 'default';

  // Design: minimal - clean, understated
  if (design === 'minimal') {
    return (
      <div className='w-full h-full flex items-center justify-center px-6 md:px-8 lg:px-12'>
        <h2 className='text-3xl md:text-5xl lg:text-6xl font-medium text-foreground/80 tracking-wide text-center max-w-6xl'>
          {slideData.title}
        </h2>
      </div>
    );
  }

  // Design: bold - dramatic, full impact
  if (design === 'bold') {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center relative overflow-hidden px-6 md:px-8 lg:px-12'>
        {/* Bold background accent */}
        <div className='absolute inset-0 bg-accent/10' />
        <div className='absolute top-0 left-0 w-full h-2 md:h-3 bg-accent' />
        <div className='absolute bottom-0 left-0 w-full h-2 md:h-3 bg-accent' />

        <h2 className='text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tighter text-center leading-none max-w-6xl'>
          {slideData.title}
        </h2>
      </div>
    );
  }

  // Design: hero - cinematic with solid accent
  if (design === 'hero') {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center relative px-6 md:px-8 lg:px-12'>
        <div className='absolute inset-0 bg-accent/10' />

        <h2 className='text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tight text-center max-w-6xl'>
          {slideData.title}
        </h2>

        <div className='mt-12 md:mt-16 h-1.5 w-48 bg-accent rounded-full' />
      </div>
    );
  }

  // Design: centered - balanced with decorative elements
  if (design === 'centered') {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center relative px-6 md:px-8 lg:px-12'>
        {/* Decorative circles */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/20 rounded-full' />

        <div className='w-3 h-3 bg-accent rounded-full mb-10 md:mb-12' />

        <h2 className='text-4xl md:text-6xl lg:text-7xl font-bold text-foreground text-center relative z-10 max-w-6xl'>
          {slideData.title}
        </h2>

        <div className='w-3 h-3 bg-accent rounded-full mt-10 md:mt-12' />
      </div>
    );
  }

  // Default design - clean with horizontal line
  return (
    <div className='w-full h-full flex flex-col items-center justify-center relative px-6 md:px-8 lg:px-12'>
      <div className='absolute inset-0 bg-surface-subtle/30' />

      {/* Horizontal line */}
      <div className='absolute top-1/2 left-12 right-12 h-px bg-border' />

      <h2
        className={cn(
          'text-5xl md:text-7xl lg:text-8xl font-black text-foreground uppercase tracking-tight text-center relative z-10 max-w-6xl',
        )}
      >
        {slideData.title}
      </h2>

      <div className='mt-12 md:mt-16 h-1 w-32 bg-accent rounded-full' />
    </div>
  );
};
