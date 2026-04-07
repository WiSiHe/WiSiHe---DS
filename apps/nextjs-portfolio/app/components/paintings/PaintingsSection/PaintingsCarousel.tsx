'use client';

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import type { RandomPaintingsQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, type Variants } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import PaintingCard from '../PaintingCard/PaintingCard';

type PaintingsCarouselProps = {
  paintings: RandomPaintingsQueryResult;
};

const PaintingsCarousel = ({ paintings }: PaintingsCarouselProps) => {
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
  };

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className='md:hidden'
      aria-label='Featured paintings carousel'
    >
      <motion.div variants={itemVariants} className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex gap-4'>
            {paintings.map((painting, index) => (
              <div key={painting._id} className='w-96 shrink-0'>
                <PaintingCard
                  paintingData={
                    // biome-ignore lint/suspicious/noExplicitAny: RandomPaintingsQueryResult shape differs from GetAllPaintingsandTagsResult
                    painting as any
                  }
                  shouldBeLazy={index < 2}
                  alwaysShowTags
                />
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
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='flex flex-col items-center justify-center gap-4 text-foreground'
      >
        <p>Like what you see?</p>
        <Link
          href='/paintings'
          className='px-4 py-2 text-accent-contrast transition-all duration-300 rounded-full bg-accent hover:bg-accent-hover'
        >
          Explore all paintings
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default PaintingsCarousel;
