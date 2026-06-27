'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PaintingsMobileSlide from './PaintingsMobileSlide';

// biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
type PaintingsCarouselProps = {
  paintings: any[];
  showFooter?: boolean;
  className?: string;
};

const PaintingsCarousel = ({ paintings, showFooter = true, className }: PaintingsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
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

  // Check for empty paintings after all hooks are called
  if (!paintings || paintings.length === 0) {
    return null;
  }

  return (
    <section className={cn('md:hidden', className)} aria-label='Featured paintings carousel'>
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-4'>
            {paintings.map((painting, index) => (
              <PaintingsMobileSlide
                key={painting._id ?? painting.objectID ?? index}
                painting={painting}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button
            type='button'
            variant='accent'
            size='icon'
            className='relative z-10 shrink-0 rounded-full'
            Icon={IconArrowNarrowLeft}
            aria-label='Scroll left'
            onClick={scrollPrev}
            isDisabled={!canScrollPrev}
          />
          <Button
            type='button'
            variant='accent'
            size='icon'
            className='relative z-10 shrink-0 rounded-full'
            Icon={IconArrowNarrowRight}
            aria-label='Scroll right'
            onClick={scrollNext}
            isDisabled={!canScrollNext}
          />
        </div>
      </div>

      {showFooter ? (
        <div className='flex flex-col items-center justify-center gap-4 text-foreground'>
          <p>Like what you see?</p>
          <Link
            href='/paintings'
            className='px-4 py-2 text-accent-contrast transition-all duration-300 rounded-full bg-accent hover:bg-accent-hover'
          >
            Explore all paintings
          </Link>
        </div>
      ) : null}
    </section>
  );
};

export default PaintingsCarousel;
