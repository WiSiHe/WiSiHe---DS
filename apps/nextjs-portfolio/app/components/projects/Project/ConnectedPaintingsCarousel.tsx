'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import type { ProjectQueryResult } from '@wisihe/sanity-queries';
import { isNotEmptyArray } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

interface ConnectedPaintingsCarouselProps {
  paintings: NonNullable<ProjectQueryResult>['connectedPaintings'];
}

export default function ConnectedPaintingsCarousel({ paintings }: ConnectedPaintingsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onInit();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('init', onInit);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('init', onInit);
    };
  }, [emblaApi, onSelect, onInit]);

  const handleLinkClick = useCallback((_e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow normal link navigation - no lightbox
    // Event propagation is already stopped in onPointerDown, so clicks work correctly
  }, []);

  const handleLinkPointerDown = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    // Stop propagation to prevent Embla from capturing the pointer event
    // This ensures clicks go to the link, not the carousel drag handler
    e.stopPropagation();
  }, []);

  if (!isNotEmptyArray(paintings)) return null;

  return (
    <div className='space-y-4'>
      <h2 className='font-serif text-lg font-semibold text-foreground'>Related paintings</h2>

      <div className='relative rounded-2xl border border-border/80 bg-surface p-3 shadow-sm'>
        <div className='overflow-hidden rounded-xl' ref={emblaRef}>
          <div className='flex gap-4'>
            {paintings.map(painting => {
              const { image, slug, title } = painting;
              if (!image || !slug) return null;

              return (
                <div
                  key={`${slug}-${title}`}
                  className='flex-[0_0_auto] min-w-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'
                >
                  <Link
                    href={`/paintings/${slug}`}
                    className='relative aspect-square group transition-transform hover:scale-105 block rounded-xl overflow-hidden'
                    onClick={handleLinkClick}
                    onPointerDown={handleLinkPointerDown}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    <Image
                      src={urlForImage(image)?.width(400).fit('max')?.url() || ''}
                      alt={title || 'Connected painting'}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className='object-cover transition-opacity group-hover:opacity-90 pointer-events-none'
                      loading='lazy'
                      draggable={false}
                    />
                    {title && (
                      <div className='absolute bottom-0 left-0 right-0 bg-black/65 backdrop-blur-md text-white p-2 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity'>
                        <p className='text-sm font-medium truncate'>{title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        {paintings.length > 1 ? (
          <div className='mt-3 flex items-center justify-between gap-3'>
            <button
              type='button'
              className='flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface-subtle text-foreground transition-colors hover:bg-accent hover:text-accent-contrast disabled:cursor-not-allowed disabled:opacity-40'
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label='Scroll to previous painting'
            >
              <IconArrowNarrowLeft className='size-4' />
            </button>

            {scrollSnaps.length > 1 ? (
              <div className='flex gap-1.5'>
                {scrollSnaps.map((_, index) => (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: scroll snaps have no other stable identifier
                    key={index}
                    className={`size-2 rounded-full transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent'
                        : 'bg-border hover:bg-foreground-muted/40'
                    }`}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : (
              <span aria-hidden />
            )}

            <button
              type='button'
              className='flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface-subtle text-foreground transition-colors hover:bg-accent hover:text-accent-contrast disabled:cursor-not-allowed disabled:opacity-40'
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label='Scroll to next painting'
            >
              <IconArrowNarrowRight className='size-4' />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
