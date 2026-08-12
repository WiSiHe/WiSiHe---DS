'use client';

import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '@/lib/presentations/types';
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

type ContentSlideProps = {
  slideData: PresentationSlide;
  index: number;
  totalSlides: number;
};

export function ContentSlide({ slideData, index, totalSlides }: ContentSlideProps) {
  const slideDesign = (slideData.slideDesign || 'default') as SlideDesign;

  if (slideData.examples?.length) {
    return (
      <ExampleSlideLayout
        slideData={slideData}
        index={index}
        totalSlides={totalSlides}
        slideDesign={slideDesign}
      />
    );
  }

  return (
    <div
      className={cn(
        'h-full w-full max-w-full overflow-hidden',
        getLayoutClasses(slideDesign),
        'p-6 md:p-8 lg:p-12 xl:p-16',
      )}
    >
      <article
        className={cn(
          getContentClasses(slideDesign),
          'max-h-full max-w-full min-w-0 overflow-x-hidden overflow-y-auto px-2',
        )}
      >
        <SlideHeader category={slideData.category} index={index} totalSlides={totalSlides} />
        <SlideContent slideData={slideData} slideDesign={slideDesign} />
        {slideData.sources?.length ? <SlideSources sources={slideData.sources} /> : null}
      </article>

      <div
        className={cn(
          getMediaContainerClasses(slideDesign),
          slideDesign === 'full-width' && 'order-first',
        )}
      >
        <SlideMedia slideData={slideData} index={index} />
      </div>
    </div>
  );
}
