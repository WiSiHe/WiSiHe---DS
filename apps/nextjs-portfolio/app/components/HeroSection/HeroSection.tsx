/* eslint-disable @next/next/no-img-element */
'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import Chip from '../Chip/Chip';
import GreeterCard from '../GreeterCard/GreeterCard';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);

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
  const { image, altText = '', _id } = currentBackground || {};
  const { lqip } = image || {};

  const sanityWidth = 1280;
  const sanityHeight = 720;

  return (
    <section className="relative flex flex-col justify-start xl:justify-center w-full min-h-[600px] xl:min-h-screen px-8 py-20 lg:py-10 bg-dark overflow-clip">
      <img
        src={lqip || ''}
        alt=""
        className="absolute inset-0 object-cover w-full h-full scale-105 blur-xl"
        sizes="100vw"
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center">
        <section className="z-20 w-full xl:absolute col-span-full xl:col-span-4 xl:col-start-1 top-44">
          <GreeterCard />
        </section>
        <section className="relative z-10 w-full col-span-full xl:col-span-10 xl:col-start-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPaintingsIndex}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: 'spring' }}
              className="relative w-full h-full aspect-video rounded-2xl bg-dark/20"
            >
              <div className="absolute left-0 right-0 z-10 flex items-center justify-center rounded-full -top-2 drop-shadow-xl">
                <Chip Icon={FaStar} label="Featured" />
              </div>
              {image && (
                <Image
                  key={_id + 'hero'}
                  src={
                    urlForImage(image)
                      ?.width(sanityWidth)
                      .height(sanityHeight)
                      .quality(60)
                      .auto('format')
                      .url() || ''
                  }
                  alt={altText || 'Image'}
                  placeholder="blur"
                  blurDataURL={lqip || undefined}
                  quality={40}
                  fill
                  priority
                  sizes="(min-width: 2080px) 780px, (min-width: 1280px) calc(47.44vw + 84px), calc(100vw - 32px)"
                  className={cn('object-cover w-10 rounded-2xl bg-tertiary')}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <section className="z-10 flex items-center justify-between w-full gap-4 pt-6 pb-10 capitalize xl:col-start-5 col-span-full xl:justify-center xl:gap-6">
            <button
              className="p-3 text-white rounded-lg bg-primary"
              onClick={handlePreviousBackground}
              aria-label="Previous painting"
            >
              <FaChevronLeft />
            </button>
            <Link
              href="/paintings"
              className="px-4 py-2 text-white rounded bg-primary "
            >
              Painting Gallery
            </Link>
            <button
              className="p-3 text-white rounded-lg bg-primary"
              onClick={handleNextBackground}
              aria-label="Next painting"
            >
              <FaChevronRight />
            </button>
          </section>
        </section>
      </div>
    </section>
  );
};

export default HeroImageSection;
