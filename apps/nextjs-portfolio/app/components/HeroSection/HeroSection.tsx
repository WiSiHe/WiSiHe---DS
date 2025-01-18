/* eslint-disable @next/next/no-img-element */
'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GreeterCard from '../GreeterCard/GreeterCard';

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
// };

// const textVariants = {
//   hidden: { width: 0, opacity: 0 },
//   visible: { width: 'auto', opacity: 1 },
// };

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
  const { image, altText = '', _id, slug } = currentBackground || {};
  const { lqip } = image || {};

  const sanityWidth = 1280;
  const sanityHeight = 720;

  return (
    <motion.section
      ref={constraintsRef}
      className="relative flex flex-col justify-start w-full px-10 pt-20 h-fit lg:min-h-screen xl:justify-center xl:min-h-screen lg:py-10 bg-dark overflow-clip"
    >
      <img
        src={lqip || ''}
        alt=""
        className="absolute inset-0 object-cover w-full h-full scale-105 blur-xl"
        sizes="100vw"
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:gap-10 xl:items-center">
        <motion.section
          drag={false}
          whileDrag={{ scale: 1.05, rotate: 5 }}
          dragElastic={1} // Higher the value, the more elastic the drag
          dragTransition={{ bounceStiffness: 50, bounceDamping: 10 }}
          dragConstraints={constraintsRef}
          // dragMomentum={false}
          className="z-20 w-full xl:absolute col-span-full xl:col-span-4 xl:col-start-1 top-44"
        >
          <GreeterCard />
        </motion.section>
        <motion.section
          ref={innerConstraintRef}
          className="relative z-10 w-full col-span-full xl:col-span-10 xl:col-start-2"
        >
          <AnimatePresence mode="wait">
            <Link
              href={`paintings/${slug}`}
              aria-label="View painting"
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <motion.div
                key={currentPaintingsIndex}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ type: 'spring' }}
                className="relative w-full h-full aspect-video rounded-2xl bg-dark/20"
              >
                {/* <div className="absolute left-0 right-0 z-10 flex items-center justify-center rounded-full cursor-pointer -top-5 drop-shadow-xl">
                <motion.div
                  whileDrag={{ scale: 0.95 }}
                  drag
                  dragConstraints={innerConstraintRef}
                >
                  <Chip Icon={FaStar} label="Featured" />
                </motion.div>
              </div> */}

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
                    // Adjust these sizes as necessary for your layout
                    sizes="(min-width: 2080px) 780px, (min-width: 1280px) calc(47.44vw + 84px), calc(100vw - 32px)"
                    className={cn('object-cover w-10 rounded-2xl bg-tertiary')}
                  />
                )}
              </motion.div>
            </Link>
          </AnimatePresence>

          <section className="z-10 flex items-center justify-center w-full gap-4 pt-6 pb-10 capitalize xl:col-start-5 col-span-full xl:gap-6">
            <motion.button
              // whileDrag={{ scale: 0.95 }} // Prevent scale on
              // drag
              className="p-3 bg-white rounded-lg text-dark"
              onClick={handlePreviousBackground}
              aria-label="Previous painting"
            >
              <FaChevronLeft />
            </motion.button>
            <Link
              href="/paintings"
              className="px-4 py-2 text-white rounded bg-primary "
            >
              Painting Gallery
            </Link>
            <button
              className="p-3 bg-white rounded-lg text-dark"
              onClick={handleNextBackground}
              aria-label="Next painting"
            >
              <FaChevronRight />
            </button>
          </section>
        </motion.section>
      </div>
    </motion.section>
  );
};

export default HeroImageSection;
