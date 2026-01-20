import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@wisihe/utils';
import type { PortableTextBlock } from 'next-sanity';
import type { PresentationSlide } from '../../../three-d/types';
import PresentationPortableText from '../PresentationPortableText';
import { isPortableText, isContentItemArray, getAspectRatioClass, type SlideDesign } from './utils';
import { useLazyIframe } from './hooks';
import { SlideHeader } from './SlideHeader';
import { SlideSources } from './SlideSources';

interface ExampleSlideLayoutProps {
  slideData: PresentationSlide;
  index: number;
  slideDesign: SlideDesign;
}

export const ExampleSlideLayout = ({
  slideData,
  index,
  slideDesign,
}: ExampleSlideLayoutProps) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const exampleIframeRef = useLazyIframe();
  const selectedExample = slideData.examples?.[selectedExampleIndex];

  if (!selectedExample) return null;

  const ExternalLinkIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 overflow-hidden max-w-full">
      {/* Left Side - Example List */}
      <div className="flex-1 flex flex-col justify-center space-y-4 overflow-y-auto max-h-full overflow-x-hidden min-w-0 max-w-full">
        <div className="max-w-6xl mx-auto w-full">
          <SlideHeader category={slideData.category} index={index} />

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground uppercase leading-tight tracking-tight break-words">
            {slideData.title}
          </h2>

          {slideData.subtitle && (
            <p className="text-2xl md:text-3xl lg:text-4xl text-accent font-bold mb-6 md:mb-8 break-words">
              {slideData.subtitle}
            </p>
          )}

          {slideData.content && slideData.content.length > 0 && (
            <div className="text-xl md:text-2xl text-foreground/80 mb-6 md:mb-8 leading-relaxed break-words">
              {isPortableText(slideData.content) && (
                <PresentationPortableText
                  value={slideData.content as PortableTextBlock[]}
                  slideDesign={slideDesign}
                />
              )}
              {isContentItemArray(slideData.content) && (
                <p>
                  {typeof slideData.content[0] === 'string'
                    ? slideData.content[0].trim().replace(/^•\s*/, '')
                    : slideData.content[0].text.trim().replace(/^•\s*/, '')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Example Buttons */}
        <div className="max-w-6xl mx-auto w-full space-y-2">
          {slideData.examples?.map((example, exampleIndex) => (
            <button
              key={exampleIndex}
              onClick={() => setSelectedExampleIndex(exampleIndex)}
              type="button"
              className={cn(
                'w-full text-left p-3 md:p-3.5 rounded-lg border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selectedExampleIndex === exampleIndex
                  ? 'bg-accent/20 border-accent shadow-md shadow-accent/20'
                  : 'bg-surface-elevated border-border hover:border-accent/50 hover:bg-surface'
              )}
              aria-label={`View ${example.name} example`}
              aria-pressed={selectedExampleIndex === exampleIndex}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3
                    className={cn(
                      'text-base md:text-lg font-bold mb-1 transition-colors',
                      selectedExampleIndex === exampleIndex ? 'text-accent' : 'text-foreground'
                    )}
                  >
                    {example.name}
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                    {example.description}
                  </p>
                </div>
                {selectedExampleIndex === exampleIndex && (
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Sources */}
        {slideData.sources && slideData.sources.length > 0 && (
          <SlideSources sources={slideData.sources} variant="compact" />
        )}
      </div>

      {/* Right Side - Example Showcase */}
      <div className="shrink-0 lg:w-1/2 flex items-center justify-center max-w-full overflow-hidden min-w-0">
        <div key={selectedExampleIndex} className="w-full">
          {selectedExample.image ? (
            <>
              <div
                className={cn(
                  'relative rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-full bg-surface/50',
                  getAspectRatioClass(slideData.imageAspectRatio)
                )}
              >
                <Image
                  src={selectedExample.image}
                  alt={`${selectedExample.name} - ${selectedExample.description || 'Interactive 3D example'}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              {selectedExample.url && (
                <a
                  href={selectedExample.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors group"
                >
                  <ExternalLinkIcon />
                  <span className="truncate">{selectedExample.url}</span>
                </a>
              )}
            </>
          ) : selectedExample.iframe ? (
            <>
              <div
                ref={exampleIframeRef.containerRef}
                className="relative w-full rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 max-h-[60vh] bg-surface/50"
              >
                {exampleIframeRef.isVisible ? (
                  <iframe
                    src={selectedExample.iframe}
                    className="w-full h-full border-0 min-h-[400px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${selectedExample.name} Demo`}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface/30">
                    <div className="text-foreground/40 text-sm">Loading...</div>
                  </div>
                )}
              </div>
              {selectedExample.url && (
                <a
                  href={selectedExample.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors group"
                >
                  <ExternalLinkIcon />
                  <span className="truncate">{selectedExample.url}</span>
                </a>
              )}
            </>
          ) : selectedExample.url ? (
            <a
              href={selectedExample.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors group"
            >
              <ExternalLinkIcon />
              <span className="truncate">{selectedExample.url}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
