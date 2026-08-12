import type { PortableTextBlock } from '@portabletext/react';
import { cn } from '@wisihe/utils';
import type { PresentationSlide } from '@/lib/presentations/types';
import PresentationPortableText from '../PresentationPortableText';
import { ContentItemList } from './ContentItemList';
import {
  getSubtitleClasses,
  getTitleClasses,
  isContentItemArray,
  isPortableText,
  type SlideDesign,
} from './utils';

type SlideContentProps = {
  slideData: PresentationSlide;
  slideDesign: SlideDesign;
};

export function SlideContent({ slideData, slideDesign }: SlideContentProps) {
  return (
    <div className='mx-auto w-full max-w-6xl space-y-6 md:space-y-8 lg:space-y-10'>
      <h2
        className={cn(
          getTitleClasses(slideDesign),
          'mb-6 leading-tight font-black tracking-tight text-foreground uppercase md:mb-8',
          'break-words',
        )}
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      >
        {slideData.title}
      </h2>

      {slideData.subtitle ? (
        <h3
          className={cn('font-bold wrap-break-words text-accent', getSubtitleClasses(slideDesign))}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {slideData.subtitle}
        </h3>
      ) : null}

      {slideData.content && isPortableText(slideData.content) ? (
        <div className='mx-auto w-full max-w-6xl'>
          <PresentationPortableText
            value={slideData.content as PortableTextBlock[]}
            slideDesign={slideDesign}
          />
        </div>
      ) : null}

      {slideData.content && isContentItemArray(slideData.content) ? (
        <ContentItemList items={slideData.content} slideDesign={slideDesign} />
      ) : null}
    </div>
  );
}
