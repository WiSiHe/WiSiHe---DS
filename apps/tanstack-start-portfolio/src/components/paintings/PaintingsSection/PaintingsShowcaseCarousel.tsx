'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@wisihe/ui-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from '@/components/ui/Image';
import { resolvePaintingCardLayout, urlForPaintingCard } from '@/lib/paintings/paintingCardImage';
import { paintingSlug } from '@/lib/paintings/paintingCompactCardProps';

type PaintingsShowcaseCarouselProps = {
  paintings: Array<Record<string, unknown>>;
};

export default function PaintingsShowcaseCarousel({ paintings }: PaintingsShowcaseCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    skipSnaps: false,
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

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

  return (
    <div className='relative px-12 md:px-16'>
      <div ref={emblaRef} className='overflow-hidden'>
        <ul className='flex touch-pan-y gap-4 md:gap-6'>
          {paintings.map(painting => {
            const slug = paintingSlug(painting);
            const title = (painting.title as string | undefined)?.trim() || 'Untitled';
            const layout = resolvePaintingCardLayout({
              format: painting.format as string | null | undefined,
              aspectRatio: (painting.image as { aspectRatio?: number } | undefined)?.aspectRatio,
            });
            const imageSrc = urlForPaintingCard(
              painting.image as Parameters<typeof urlForPaintingCard>[0],
              layout,
              85,
            );

            return (
              <li
                key={(painting._id as string) ?? slug}
                className='min-w-0 flex-[0_0_72%] sm:flex-[0_0_55%] md:flex-[0_0_42%]'
              >
                <Link
                  to={(slug ? `/paintings/${slug}` : '/paintings') as '/'}
                  className='group block overflow-hidden rounded-xl border border-border/40 bg-surface shadow-md transition-shadow hover:shadow-lg'
                >
                  <div className='relative aspect-[3/4] w-full overflow-hidden'>
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-surface-elevated' />
                    )}
                  </div>
                  <p className='px-3 py-2 text-sm font-medium text-foreground'>{title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        type='button'
        variant='secondary'
        size='small'
        className='absolute top-1/2 left-0 -translate-y-1/2 rounded-full'
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label='Previous painting'
      >
        <IconArrowNarrowLeft className='size-4' />
      </Button>
      <Button
        type='button'
        variant='secondary'
        size='small'
        className='absolute top-1/2 right-0 -translate-y-1/2 rounded-full'
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label='Next painting'
      >
        <IconArrowNarrowRight className='size-4' />
      </Button>
    </div>
  );
}
