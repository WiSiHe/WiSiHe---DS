'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import PaintingCard from '@/app/components/paintings/PaintingCard/PaintingCard';
import { paintingSlug } from '@/lib/paintings/paintingCompactCardProps';

// biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
type PaintingsShowcaseCarouselProps = {
  paintings: any[];
};

/** Accessible Embla carousel — used on mobile and when reduced motion is preferred. */
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

  const items = paintings.filter(p => p.image && paintingSlug(p));

  if (!items.length) {
    return null;
  }

  return (
    <div className='relative touch-pan-x'>
      <div className='overflow-hidden py-1' ref={emblaRef}>
        <div className='flex gap-3 md:gap-4'>
          {items.map((painting, index) => (
            <div
              key={painting._id ?? painting.objectID ?? index}
              className='w-[min(78vw,320px)] shrink-0 md:w-[min(38vw,380px)] lg:w-[min(28vw,340px)]'
            >
              <PaintingCard
                paintingData={painting}
                shouldBeLazy={index > 2}
                isNsfwFilterActive={false}
                disableBrushReveal
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4 flex justify-end gap-2 md:mt-6'>
        <Button
          type='button'
          variant='accent'
          size='icon'
          className='relative z-10 shrink-0 rounded-full'
          Icon={IconArrowNarrowLeft}
          aria-label='Previous painting'
          onClick={scrollPrev}
          isDisabled={!canScrollPrev}
        />
        <Button
          type='button'
          variant='accent'
          size='icon'
          className='relative z-10 shrink-0 rounded-full'
          Icon={IconArrowNarrowRight}
          aria-label='Next painting'
          onClick={scrollNext}
          isDisabled={!canScrollNext}
        />
      </div>
    </div>
  );
}
