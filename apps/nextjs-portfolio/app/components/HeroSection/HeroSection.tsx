'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useMemo } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);

  // Memoize handlers to reduce re-renders - must be before early return
  const handleNextBackground = useCallback(() => {
    if (!paintings || paintings.length === 0) return;
    setCurrentPaintingsIndex(prevIndex => (prevIndex + 1) % paintings.length);
  }, [paintings]);

  const handlePreviousBackground = useCallback(() => {
    if (!paintings || paintings.length === 0) return;
    setCurrentPaintingsIndex(prevIndex => (prevIndex === 0 ? paintings.length - 1 : prevIndex - 1));
  }, [paintings]);

  // Memoize image props to prevent unnecessary recalculations - must be before early return
  const imageProps = useMemo(() => {
    if (!paintings || paintings.length === 0) return null;

    const currentBackground = paintings[currentPaintingsIndex];
    const { image, altText = '' } = currentBackground || {};
    const { lqip } = image || {};

    if (!image) return null;

    return {
      src: urlForImage(image)?.width(1200).height(675).auto('format').quality(75).url() || '',
      alt: altText || 'Hero painting',
      blurDataURL: lqip || '',
    };
  }, [paintings, currentPaintingsIndex]);

  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  const currentBackground = paintings[currentPaintingsIndex];
  const { image, slug } = currentBackground || {};
  const { lqip } = image || {};

  return (
    <motion.section className="relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-surface overflow-clip">
      {/* Optimized background blur - use smaller image for blur effect */}
      <Image
        src={lqip || ''}
        alt=""
        fill
        className="absolute inset-0 object-cover scale-150 blur-3xl"
        sizes="100vw"
        priority
        quality={30}
        placeholder="blur"
        blurDataURL={lqip || ''}
      />

      <div className="relative z-10 flex flex-col items-start w-full gap-4 mx-auto max-w-(--breakpoint-2xl) xl:grid xl:grid-cols-12 xl:pt-32 xl:items-start">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }} // Reduced duration
          className="z-20 p-4 rounded-xl left-4 xl:p-4 xl:top-36 md:max-w-96 xl:absolute col-span-full xl:bg-black/40 xl:backdrop-blur-2xl text-white"
        >
          <motion.p
            className=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }} // Reduced delay and duration
          >
            My name is
          </motion.p>
          <motion.h1
            className="text-4xl font-black"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }} // Reduced delay and duration
          >
            Henrik
          </motion.h1>
          <motion.p
            className=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }} // Reduced delay and duration
          >
            I&apos;m a design engineer, painter and a maker, here are some of my paintings, please
            take a gander.
          </motion.p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }} // Reduced duration
          className="relative z-10 w-full col-span-full xl:col-span-full"
        >
          <Link
            key={currentPaintingsIndex + 'painting-link'}
            href={`paintings/${slug}`}
            aria-label="View painting"
            className="absolute z-10 flex items-center gap-2 px-2 py-1 text-sm rounded-full text-on-primary focus-visible:ring-2 focus-visible:ring-primary bg-accent/80 backdrop-blur-2xl top-4 right-4 hover:bg-accent"
          >
            View Painting <FaArrowRight />
          </Link>
          <AnimatePresence mode="wait">
            {image && imageProps && (
              <motion.div
                key={currentPaintingsIndex}
                initial={{ scale: 0.99 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }} // Optimized spring settings
                className="relative w-full h-full aspect-square lg:aspect-video drop-shadow-2xl rounded-2xl bg-surface/20"
              >
                <Image
                  src={imageProps.src}
                  alt={imageProps.alt}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  priority
                  quality={75}
                  placeholder="blur"
                  blurDataURL={imageProps.blurDataURL}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <section className="absolute bottom-0 z-10 flex items-center justify-center w-full gap-4 p-4 capitalize xl:col-start-5 col-span-full xl:gap-6 xl:justify-center">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center p-3 font-medium transition-all duration-300 rounded-full shadow-lg text-on-primary bg-accent/80 backdrop-blur-2xl hover:bg-accent hover:shadow-xl"
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
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center px-6 py-3 font-medium text-on-primary transition-all duration-300 rounded-full shadow-lg bg-primary/80 backdrop-blur-2xl hover:bg-primary hover:shadow-xl"
              >
                View Gallery
              </motion.div>
            </Link>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex items-center p-3 font-medium transition-all duration-300 rounded-full shadow-lg text-on-primary bg-accent/80 backdrop-blur-2xl hover:bg-accent hover:shadow-xl"
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
