'use client';

import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '../../../three-d/types';
import { ExampleSlideLayout } from './ExampleSlideLayout';
import { SlideContent } from './SlideContent';
import { SlideHeader } from './SlideHeader';
import { SlideMedia } from './SlideMedia';
import { SlideSources } from './SlideSources';
import {
  getContentClasses,
  getLayoutClasses,
  getMediaContainerClasses,
  type SlideDesign,
} from './utils';

interface ContentSlideProps {
  slideData: PresentationSlide;
  index: number;
  shouldAnimate?: boolean;
  slideDirection?: 'up' | 'down';
  currentHistorySlideIndex?: number;
}

export const ContentSlide = ({
  slideData,
  index,
  shouldAnimate: _shouldAnimate,
  slideDirection: _slideDirection,
  currentHistorySlideIndex,
}: ContentSlideProps) => {
  // Get slide design variant - ensure consistent value for SSR
  const slideDesign = (slideData.slideDesign || 'default') as SlideDesign;

  // If examples exist, use interactive example selection layout
  if (slideData.examples && slideData.examples.length > 0) {
    return <ExampleSlideLayout slideData={slideData} index={index} slideDesign={slideDesign} />;
  }

  // Default layout for non-example slides
  return (
    <div
      className={cn(
        'w-full h-full overflow-hidden max-w-full',
        getLayoutClasses(slideDesign),
        'p-6 md:p-8 lg:p-12 xl:p-16',
      )}
    >
      {/* Content Section */}
      <article
        className={cn(
          getContentClasses(slideDesign),
          'overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full px-2',
        )}
      >
        <SlideHeader category={slideData.category} index={index} />
        <SlideContent slideData={slideData} slideDesign={slideDesign} />
        {slideData.sources && slideData.sources.length > 0 && (
          <SlideSources sources={slideData.sources} />
        )}
      </article>

      {/* Media Section */}
      <div
        className={cn(
          getMediaContainerClasses(slideDesign),
          slideDesign === 'full-width' && 'order-first',
        )}
      >
        <SlideMedia
          slideData={slideData}
          index={index}
          currentHistorySlideIndex={currentHistorySlideIndex}
        />
      </div>
    </div>
  );
};
