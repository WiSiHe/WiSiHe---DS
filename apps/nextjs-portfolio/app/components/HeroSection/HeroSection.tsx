/* eslint-disable @next/next/no-img-element */
'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GreeterCard from '../GreeterCard/GreeterCard';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);
  const constraintsRef = useRef(null);
  const innerConstraintRef = useRef(null);
  // Fallback for when paintings is null or empty
  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  const handleNextBackground = () => {
    setCurrentPaintingsIndex((prevIndex) => (prevIndex + 1) % paintings.length);
  };

  const handlePreviousBackground = () => {
    setCurrentPaintingsIndex((prevIndex) =>
      prevIndex === 0 ? paintings.length - 1 : prevIndex - 1
    );
  };

  const currentBackground = paintings[currentPaintingsIndex];
  const { image, altText = '', slug } = currentBackground || {};
  const { lqip } = image || {};

  const sanityWidth = 1920;
  const sanityHeight = 1080;

  const common = {
    alt: altText || 'Painting',
    fill: 'true',
    className: 'object-cover',
  };

  // Optimized sizes for different viewports
  const sizes = {
    desktop: { width: 1920, height: 1080, quality: 80 },
    laptop: { width: 1440, height: 810, quality: 75 },
    tablet: { width: 1024, height: 576, quality: 70 },
    mobile: { width: 640, height: 360, quality: 65 },
    smallMobile: { width: 320, height: 180, quality: 60 },
  };

  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    quality: sizes.desktop.quality,
    fill: true,
    priority: true,
    fetchPriority: 'high',
    src:
      urlForImage(image)
        ?.width(sizes.desktop.width)
        .height(sizes.desktop.height)
        .url() || '',
  });

  const {
    props: { srcSet: laptop },
  } = getImageProps({
    ...common,
    quality: sizes.laptop.quality,
    fill: true,
    priority: true,
    fetchPriority: 'high',
    src:
      urlForImage(image)
        ?.width(sizes.laptop.width)
        .height(sizes.laptop.height)
        .url() || '',
  });

  const {
    props: { srcSet: tablet },
  } = getImageProps({
    ...common,
    quality: sizes.tablet.quality,
    fill: true,
    priority: true,
    fetchPriority: 'high',
    src:
      urlForImage(image)
        ?.width(sizes.tablet.width)
        .height(sizes.tablet.height)
        .url() || '',
  });

  const {
    props: { srcSet: mobile },
  } = getImageProps({
    ...common,
    quality: sizes.mobile.quality,
    fill: true,
    priority: true,
    fetchPriority: 'high',
    src:
      urlForImage(image)
        ?.width(sizes.mobile.width)
        .height(sizes.mobile.height)
        .url() || '',
  });

  const {
    props: { srcSet: smallMobile },
  } = getImageProps({
    ...common,
    quality: sizes.smallMobile.quality,
    fill: true,
    priority: true,
    fetchPriority: 'high',
    src:
      urlForImage(image)
        ?.width(sizes.smallMobile.width)
        .height(sizes.smallMobile.height)
        .url() || '',
  });

  return (
    <motion.section
      ref={constraintsRef}
      className="relative flex flex-col items-end justify-center w-full px-4 py-24 h-fit md:px-10 lg:min-h-[85vh] xl:justify-center xl:min-h-[85vh] lg:py-10 bg-dark overflow-clip"
    >
      <img
        src={lqip || ''}
        alt=""
        className="absolute inset-0 object-cover w-full h-full scale-105 blur-2xl"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-(--breakpoint-2xl) xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center">
        <motion.section className="z-20 w-full xl:absolute col-span-full xl:col-span-4 xl:col-start-1 top-44">
          <GreeterCard />
        </motion.section>
        <motion.section
          ref={innerConstraintRef}
          className="relative z-10 w-full col-span-full xl:col-span-10 xl:col-start-2"
        >
          <AnimatePresence mode="wait">
            <Link
              key={currentPaintingsIndex + 'painting-link'}
              href={`paintings/${slug}`}
              aria-label="View painting"
              className="absolute z-10 flex items-center gap-2 px-4 py-3 text-white rounded-lg focus-visible:ring-2 focus-visible:ring-primary bg-primary top-4 right-4"
            >
              View Painting <FaArrowRight />
            </Link>
            <motion.div
              key={currentPaintingsIndex}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring' }}
              className="relative w-full h-full aspect-square drop-shadow-2xl lg:aspect-video rounded-2xl bg-dark/20"
            >
              {image && (
                <picture className="w-full h-full rounded-2xl overflow-clip">
                  <source media="(min-width: 1920px)" srcSet={desktop} />
                  <source media="(min-width: 1440px)" srcSet={laptop} />
                  <source media="(min-width: 1024px)" srcSet={tablet} />
                  <source media="(min-width: 640px)" srcSet={mobile} />
                  <source media="(min-width: 320px)" srcSet={smallMobile} />
                  <img
                    {...common}
                    className={cn(
                      'object-cover w-full h-full overflow-clip rounded-2xl'
                    )}
                    src={
                      urlForImage(image)
                        ?.width(sanityWidth)
                        .height(sanityHeight)
                        .auto('format')
                        .quality(75)
                        .url() || ''
                    }
                    alt={altText || 'Image'}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    sizes="(min-width: 1920px) 1920px, (min-width: 1440px) 1440px, (min-width: 1024px) 1024px, (min-width: 640px) 640px, 320px"
                  />
                </picture>
              )}
            </motion.div>
          </AnimatePresence>

          <section className="z-10 flex items-center justify-center w-full gap-4 pt-6 pb-10 capitalize xl:col-start-5 col-span-full xl:gap-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring' }}
              className="p-3 bg-white rounded-lg text-dark"
              onClick={handlePreviousBackground}
              aria-label="Previous painting"
            >
              <FaChevronLeft />
            </motion.button>
            <Link href="/paintings">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white transition-all duration-300 rounded-lg shadow-lg bg-primary hover:bg-primary/90 hover:shadow-xl"
              >
                View Gallery
              </motion.div>
            </Link>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring' }}
              className="p-3 bg-white rounded-lg text-dark"
              onClick={handleNextBackground}
              aria-label="Next painting"
            >
              <FaChevronRight />
            </motion.button>
          </section>
        </motion.section>
      </div>
    </motion.section>
  );
};

export default HeroImageSection;
