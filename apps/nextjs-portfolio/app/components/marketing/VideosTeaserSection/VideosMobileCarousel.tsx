'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { VideoTeaserCard } from './VideoTeaserCard';

type VideoItem = NonNullable<HomeExtrasQueryResult>['videos'][number];

type VideosMobileCarouselProps = {
  videos: VideoItem[];
};

export default function VideosMobileCarousel({ videos }: VideosMobileCarouselProps) {
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

  return (
    <section className='lg:hidden' aria-label='Videos carousel'>
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-4'>
            {videos.map((video, index) => (
              <div key={video._id} className='w-[min(88vw,340px)] shrink-0'>
                <VideoTeaserCard video={video} index={index} />
              </div>
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
            aria-label='Previous video'
            onClick={scrollPrev}
            isDisabled={!canScrollPrev}
          />
          <Button
            type='button'
            variant='accent'
            size='icon'
            className='relative z-10 shrink-0 rounded-full'
            Icon={IconArrowNarrowRight}
            aria-label='Next video'
            onClick={scrollNext}
            isDisabled={!canScrollNext}
          />
        </div>
      </div>
    </section>
  );
}
