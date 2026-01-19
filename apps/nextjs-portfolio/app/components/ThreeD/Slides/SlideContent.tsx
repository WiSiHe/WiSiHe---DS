import { cn } from '@wisihe/utils';
import type { PortableTextBlock } from 'next-sanity';
import type { PresentationSlide } from '../../../three-d/types';
import PresentationPortableText from '../PresentationPortableText';
import { isPortableText, isContentItemArray, getTitleClasses, getSubtitleClasses, type SlideDesign } from './utils';
import { ContentItemList } from './ContentItemList';

interface SlideContentProps {
  slideData: PresentationSlide;
  slideDesign: SlideDesign;
}

export const SlideContent = ({ slideData, slideDesign }: SlideContentProps) => {
  return (
    <div className="max-w-prose mx-auto w-full space-y-6 md:space-y-8 lg:space-y-10">
      <h1
        className={cn(
          getTitleClasses(slideDesign),
          'font-black mb-6 md:mb-8 text-foreground uppercase leading-tight tracking-tight break-words overflow-wrap-anywhere'
        )}
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      >
        {slideData.title}
      </h1>

      {slideData.subtitle && (
        <h2
          className={cn('text-accent font-bold wrap-break-words overflow-wrap-anywhere', getSubtitleClasses(slideDesign))}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {slideData.subtitle}
        </h2>
      )}

      {/* Content - Portable Text (Sanity) or ContentItem[] (static fallback) */}
      {slideData.content && isPortableText(slideData.content) && (
        <div className="max-w-prose mx-auto w-full">
          <PresentationPortableText
            value={slideData.content as PortableTextBlock[]}
            slideDesign={slideDesign}
          />
        </div>
      )}

      {/* Legacy ContentItem[] rendering for static fallback slides */}
      {slideData.content && isContentItemArray(slideData.content) && (
        <ContentItemList items={slideData.content} slideDesign={slideDesign} />
      )}
    </div>
  );
};
