'use client';

import type { PortableTextBlock } from '@portabletext/react';
import { cn } from '@wisihe/utils';
import { useState } from 'react';
import Image from '@/components/ui/Image';
import type { PresentationSlide } from '@/lib/presentations/types';
import { useLazyIframe } from '../hooks/useLazyIframe';
import PresentationPortableText from '../PresentationPortableText';
import { SlideHeader } from './SlideHeader';
import { SlideSources } from './SlideSources';
import { getAspectRatioClass, isContentItemArray, isPortableText, type SlideDesign } from './utils';

type ExampleSlideLayoutProps = {
  slideData: PresentationSlide;
  index: number;
  totalSlides: number;
  slideDesign: SlideDesign;
};

function ExternalLinkIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
      aria-hidden
    >
      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
      <polyline points='15 3 21 3 21 9' />
      <line x1='10' y1='14' x2='21' y2='3' />
    </svg>
  );
}

export function ExampleSlideLayout({
  slideData,
  index,
  totalSlides,
  slideDesign,
}: ExampleSlideLayoutProps) {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const exampleIframeRef = useLazyIframe();
  const selectedExample = slideData.examples?.[selectedExampleIndex];

  if (!selectedExample) return null;

  return (
    <div className='flex h-full w-full max-w-full flex-col gap-6 overflow-hidden md:gap-8 lg:flex-row lg:gap-10'>
      <div className='flex max-h-full min-w-0 max-w-full flex-1 flex-col justify-center space-y-4 overflow-x-hidden overflow-y-auto'>
        <div className='mx-auto w-full max-w-6xl'>
          <SlideHeader category={slideData.category} index={index} totalSlides={totalSlides} />

          <h2 className='mb-4 text-4xl leading-tight font-black tracking-tight break-words text-foreground uppercase md:text-6xl lg:text-7xl'>
            {slideData.title}
          </h2>

          {slideData.subtitle ? (
            <p className='mb-6 text-2xl font-bold break-words text-accent md:mb-8 md:text-3xl lg:text-4xl'>
              {slideData.subtitle}
            </p>
          ) : null}

          {slideData.content && slideData.content.length > 0 ? (
            <div className='mb-6 text-xl leading-relaxed break-words text-foreground/80 md:mb-8 md:text-2xl'>
              {isPortableText(slideData.content) ? (
                <PresentationPortableText
                  value={slideData.content as PortableTextBlock[]}
                  slideDesign={slideDesign}
                />
              ) : null}
              {isContentItemArray(slideData.content) ? (
                <p>
                  {typeof slideData.content[0] === 'string'
                    ? slideData.content[0].trim().replace(/^•\s*/, '')
                    : (slideData.content[0]?.text.trim().replace(/^•\s*/, '') ?? '')}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className='mx-auto w-full max-w-6xl space-y-2'>
          {slideData.examples?.map((example, exampleIndex) => (
            <button
              key={example.name}
              type='button'
              onClick={() => setSelectedExampleIndex(exampleIndex)}
              className={cn(
                'w-full rounded-lg border-2 p-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none md:p-3.5',
                selectedExampleIndex === exampleIndex
                  ? 'border-accent-border bg-accent text-accent-contrast shadow-md'
                  : 'border-border bg-surface hover:border-accent/50 hover:bg-surface-hover',
              )}
              aria-label={`View ${example.name} example`}
              aria-pressed={selectedExampleIndex === exampleIndex}
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1'>
                  <h3
                    className={cn(
                      'mb-1 text-base font-bold transition-colors md:text-lg',
                      selectedExampleIndex === exampleIndex ? 'text-accent' : 'text-foreground',
                    )}
                  >
                    {example.name}
                  </h3>
                  <p className='text-xs leading-relaxed text-foreground/70 md:text-sm'>
                    {example.description}
                  </p>
                </div>
                {selectedExampleIndex === exampleIndex ? (
                  <div className='mt-1 h-2 w-2 shrink-0 rounded-full bg-accent' />
                ) : null}
              </div>
            </button>
          ))}
        </div>

        {slideData.sources?.length ? (
          <SlideSources sources={slideData.sources} variant='compact' />
        ) : null}
      </div>

      <div className='flex max-w-full min-w-0 shrink-0 items-center justify-center overflow-hidden lg:w-1/2'>
        <div key={selectedExampleIndex} className='w-full'>
          {selectedExample.image ? (
            <>
              <div
                className={cn(
                  'relative w-full max-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-300 hover:shadow-xl',
                  getAspectRatioClass(slideData.imageAspectRatio),
                )}
              >
                <Image
                  src={selectedExample.image}
                  alt={`${selectedExample.name} - ${selectedExample.description || 'Example'}`}
                  fill
                  className='object-contain'
                  sizes='(max-width: 768px) 100vw, 50vw'
                  loading='lazy'
                />
              </div>
              {selectedExample.url ? (
                <a
                  href={selectedExample.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group mt-4 flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent/80'
                >
                  <ExternalLinkIcon />
                  <span className='truncate'>{selectedExample.url}</span>
                </a>
              ) : null}
            </>
          ) : selectedExample.iframe ? (
            <>
              <div
                ref={exampleIframeRef.containerRef}
                className='relative max-h-[60vh] w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-300 hover:shadow-xl'
              >
                {exampleIframeRef.isVisible ? (
                  <iframe
                    src={selectedExample.iframe}
                    className='h-full min-h-[400px] w-full border-0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title={`${selectedExample.name} Demo`}
                    loading='lazy'
                  />
                ) : (
                  <div className='flex min-h-[400px] h-full w-full items-center justify-center bg-surface-subtle'>
                    <div className='text-sm text-foreground/40'>Loading…</div>
                  </div>
                )}
              </div>
              {selectedExample.url ? (
                <a
                  href={selectedExample.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group mt-4 flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent/80'
                >
                  <ExternalLinkIcon />
                  <span className='truncate'>{selectedExample.url}</span>
                </a>
              ) : null}
            </>
          ) : selectedExample.url ? (
            <a
              href={selectedExample.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent/80'
            >
              <ExternalLinkIcon />
              <span className='truncate'>{selectedExample.url}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
