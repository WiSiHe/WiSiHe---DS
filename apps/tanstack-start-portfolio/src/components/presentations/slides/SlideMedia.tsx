'use client';

import { cn } from '@wisihe/utils';
import Image from '@/components/ui/Image';
import type { PresentationSlide } from '@/lib/presentations/types';
import { urlForImage } from '@/lib/sanity';
import { GridBackground } from '../GridBackground';
import { useLazyIframe } from '../hooks/useLazyIframe';
import { Numbers } from './Numbers';
import { getAspectRatioClass } from './utils';

type SlideMediaProps = {
  slideData: PresentationSlide;
  index: number;
};

function ChartPlaceholder({ chartType }: { chartType: string }) {
  return (
    <div className='flex min-h-[280px] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-subtle p-8 text-center'>
      <p className='text-sm text-foreground/50'>
        Chart ({chartType.replace(/-/g, ' ')}) — interactive charts ship in a later phase.
      </p>
    </div>
  );
}

export function SlideMedia({ slideData, index }: SlideMediaProps) {
  const mainIframeRef = useLazyIframe();

  if (slideData.tools?.length) {
    return (
      <div className='w-full max-w-full min-w-0 overflow-hidden rounded-2xl border-2 border-border bg-surface-elevated p-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {slideData.tools.map(tool => (
            <div
              key={tool.name}
              className='group rounded-xl border-2 border-border bg-surface p-5 transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20'
            >
              <a href={tool.url} target='_blank' rel='noopener noreferrer' className='block'>
                <div className='mb-3 flex items-start justify-between'>
                  <h3 className='text-xl font-bold text-foreground transition-colors group-hover:text-accent'>
                    {tool.name}
                  </h3>
                  <svg
                    className='h-5 w-5 text-foreground/50 transition-colors group-hover:text-accent'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </div>
              </a>
              <div className='mb-3 flex flex-wrap items-center gap-3'>
                {tool.category ? (
                  <span className='inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent-text'>
                    {tool.category}
                  </span>
                ) : null}
                {tool.nerdLevel !== undefined ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-semibold tracking-wider text-foreground/60 uppercase'>
                      Nerd Level:
                    </span>
                    <div className='flex items-center gap-1'>
                      {[1, 2, 3, 4, 5].map(level => {
                        const nerdLevel = tool.nerdLevel ?? 0;
                        return (
                          <div
                            key={level}
                            className={cn(
                              'h-2 w-2 rounded-full transition-all',
                              level <= nerdLevel
                                ? level <= 2
                                  ? 'bg-green-500'
                                  : level <= 3
                                    ? 'bg-yellow-500'
                                    : level <= 4
                                      ? 'bg-orange-500'
                                      : 'bg-red-500'
                                : 'bg-foreground/10',
                            )}
                          />
                        );
                      })}
                    </div>
                    <span className='text-xs font-bold text-foreground/70'>{tool.nerdLevel}/5</span>
                  </div>
                ) : null}
              </div>
              <p className='mb-4 text-sm leading-relaxed text-foreground/70 transition-colors group-hover:text-foreground'>
                {tool.description}
              </p>
              {tool.workshopUrl ? (
                <a
                  href={tool.workshopUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-lg border-2 border-accent-border bg-accent-subtle px-4 py-2 text-sm font-semibold text-accent-text transition-all duration-200 hover:bg-accent-surface'
                >
                  View Workshop
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slideData.iframe) {
    return (
      <div
        ref={mainIframeRef.containerRef}
        className={cn(
          'relative w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-300 hover:shadow-xl',
          getAspectRatioClass(slideData.iframeAspectRatio),
        )}
      >
        {mainIframeRef.isVisible ? (
          <iframe
            src={slideData.iframe}
            className='h-full w-full border-0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title={slideData.title || 'Embedded demo'}
            loading='lazy'
          />
        ) : (
          <div className='flex min-h-[400px] h-full w-full items-center justify-center bg-surface-subtle'>
            <div className='text-sm text-foreground/40'>Loading…</div>
          </div>
        )}
      </div>
    );
  }

  if (slideData.metrics?.length) {
    return (
      <div className='w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4'>
        <Numbers metrics={slideData.metrics} />
      </div>
    );
  }

  if (slideData.chartType) {
    return (
      <div className='w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface p-4'>
        <ChartPlaceholder chartType={slideData.chartType} />
      </div>
    );
  }

  if (slideData.image) {
    const imageUrl =
      typeof slideData.image === 'object'
        ? urlForImage(slideData.image)?.width(1200).height(675).url() || ''
        : slideData.image;

    const imageAlt =
      (typeof slideData.image === 'object' && slideData.image.alt) ||
      (slideData.subtitle ? `${slideData.title} - ${slideData.subtitle}` : slideData.title);

    return (
      <div
        className={cn(
          'relative w-full max-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg transition-all duration-300 hover:shadow-xl',
          getAspectRatioClass(slideData.imageAspectRatio),
        )}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 50vw'
          loading={index <= 2 ? 'eager' : 'lazy'}
          priority={index <= 2}
        />
      </div>
    );
  }

  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-2xl border border-border/30 bg-linear-to-br from-accent/5 via-surface to-accent/10'>
      <div className='absolute inset-0 opacity-30'>
        <GridBackground />
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='h-32 w-32 rounded-full bg-accent/10 blur-3xl' />
      </div>
      <div className='absolute top-4 left-4 h-8 w-8 rounded-tl-lg border-t-2 border-l-2 border-accent/20' />
      <div className='absolute right-4 bottom-4 h-8 w-8 rounded-br-lg border-r-2 border-b-2 border-accent/20' />
      {slideData.category ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-6xl font-black tracking-widest text-accent/30 uppercase select-none md:text-8xl'>
            {slideData.category.charAt(0)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
