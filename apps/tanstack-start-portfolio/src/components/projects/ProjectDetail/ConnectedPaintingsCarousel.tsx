'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from '@/components/ui/Image';
import { imageUrl } from '@/server/fns';

type ConnectedPainting = {
  slug?: string | null;
  title?: string | null;
  image?: unknown;
};

type ConnectedPaintingsCarouselProps = {
  paintings: ConnectedPainting[] | null | undefined;
};

export function ConnectedPaintingsCarousel({ paintings }: ConnectedPaintingsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const items = (paintings ?? []).filter(p => p.slug && p.image);
  if (!items.length) return null;

  return (
    <div className='space-y-4'>
      <h2 className='font-serif text-lg font-semibold text-foreground'>Related paintings</h2>
      <div className='relative rounded-2xl border border-border/80 bg-surface p-3 shadow-sm'>
        <div className='overflow-hidden rounded-xl' ref={emblaRef}>
          <div className='flex gap-4'>
            {items.map(painting => {
              const src = imageUrl(painting.image as Parameters<typeof imageUrl>[0], 400);
              if (!src || !painting.slug) return null;
              return (
                <div
                  key={painting.slug}
                  className='min-w-0 w-full flex-[0_0_75%] sm:flex-[0_0_45%] md:flex-[0_0_33%]'
                >
                  <Link
                    to='/paintings/$slug'
                    params={{ slug: painting.slug }}
                    className='group relative block aspect-square overflow-hidden rounded-xl'
                  >
                    <Image
                      src={src}
                      alt={painting.title || 'Connected painting'}
                      fill
                      className='object-cover transition-opacity group-hover:opacity-90'
                      sizes='280px'
                    />
                    {painting.title ? (
                      <div className='absolute inset-x-0 bottom-0 bg-black/65 p-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100'>
                        {painting.title}
                      </div>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        {items.length > 1 ? (
          <div className='mt-3 flex items-center justify-between gap-3'>
            <button
              type='button'
              className={cn(
                'flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface-subtle',
                !canScrollPrev && 'opacity-40',
              )}
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label='Previous painting'
            >
              <IconChevronLeft className='size-4' stroke={2} aria-hidden />
            </button>
            <button
              type='button'
              className={cn(
                'flex size-9 items-center justify-center rounded-full border border-border/60 bg-surface-subtle',
                !canScrollNext && 'opacity-40',
              )}
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label='Next painting'
            >
              <IconChevronRight className='size-4' stroke={2} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
