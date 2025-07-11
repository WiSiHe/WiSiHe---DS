'use client';
import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { Card } from '../Card/Card';
import CustomPortableText from '../PortableText/PortableText';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';

import { type PortableTextBlock } from 'next-sanity';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';

type PaintingsSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
  paintingsDescription?: PortableTextBlock[];
};

const PaintingsSection = ({ paintings, paintingsDescription }: PaintingsSectionProps) => {
  if (!paintings || paintings.length === 0) {
    return null;
  }

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Reduced from 0.2
        delayChildren: 0.2, // Reduced from 0.3
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
        stiffness: 150, // Increased from 100
        damping: 20, // Increased from 15
      },
    },
  };

  // Optimize image sizes for better performance
  const data = paintings.map(painting => ({
    categories: painting.tagsV2 || ['Art'],
    title: painting.title || '',
    href: `/paintings/${painting.slug}`,
    src: urlForImage(painting.image)?.height(600).width(450).auto('format').quality(75).url() || '', // Further reduced from 800x600
  }));

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className=""
    >
      <motion.div variants={itemVariants} className="px-4 text-text-primary">
        {paintingsDescription && (
          <CustomPortableText value={paintingsDescription} className="prose-invert" />
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {data.map((card, index) => (
              <Card card={card} index={index} />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="relative z-10 flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer pointer-events-auto bg-primary disabled:opacity-50 hover:bg-primary-light"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Scroll left"
          >
            <IconArrowNarrowLeft className="w-6 h-6 text-on-primary" />
          </button>
          <button
            className="relative z-10 flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-full cursor-pointer pointer-events-auto bg-primary disabled:opacity-50 hover:bg-primary-light"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Scroll right"
          >
            <IconArrowNarrowRight className="w-6 h-6 text-on-primary" />
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center gap-4 text-text-primary"
      >
        <p>Like what you see?</p>
        <Link
          href="/paintings"
          className="px-4 py-2 text-on-primary transition-all duration-300 rounded-full bg-primary hover:bg-primary-light"
        >
          Explore all paintings
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default PaintingsSection;
