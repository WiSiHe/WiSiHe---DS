"use client";

import { HomePageQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>["showcasePaintings"] | null;
};

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);

  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  const handleNextBackground = () => {
    setCurrentPaintingsIndex((prevIndex) => (prevIndex + 1) % paintings.length);
  };

  const handlePreviousBackground = () => {
    setCurrentPaintingsIndex((prevIndex) =>
      prevIndex === 0 ? paintings.length - 1 : prevIndex - 1,
    );
  };

  const currentBackground = paintings[currentPaintingsIndex];
  const { image, altText = "", slug } = currentBackground || {};
  const { lqip } = image || {};

  // Define common props for both mobile and desktop
  const common = {
    alt: altText || "Image",
    fill: true,
    className: "object-cover rounded-2xl",
    quality: 70,
    placeholder: "blur" as const,
    blurDataURL: lqip || "",
  };

  // Desktop image props
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    priority: false,
    src: urlForImage(image)?.width(1920).height(1080).url() || "",
  });

  // Mobile image props
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    priority: false,
    src: urlForImage(image)?.width(800).height(800).url() || "",
  });

  return (
    <motion.section className="relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-dark overflow-clip">
      <img
        src={lqip || ""}
        alt=""
        className="absolute inset-0 object-cover w-full h-full scale-150 blur-2xl md:blur-3xl"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      <div className="relative z-10 flex flex-col items-start w-full gap-4 mx-auto max-w-(--breakpoint-2xl) xl:grid xl:grid-cols-12 xl:pt-32 xl:items-start">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-20 p-4 rounded-lg left-4 xl:p-4 xl:top-36 md:max-w-96 xl:absolute col-span-full xl:bg-white/10 xl:backdrop-blur-xl"
        >
          <div className="absolute top-0 left-0 w-full h-full" />
          <motion.p
            className="text-white text-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            My name is
          </motion.p>
          <motion.h1
            className="text-4xl font-black text-white text-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Henrik
          </motion.h1>
          <motion.p
            className="text-white text-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            I&apos;m a design engineer, painter and a maker, here are some of my
            paintings, please take a gander.
          </motion.p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full col-span-full xl:col-span-full"
        >
          <Link
            key={currentPaintingsIndex + "painting-link"}
            href={`paintings/${slug}`}
            aria-label="View painting"
            className="absolute z-10 flex items-center gap-2 px-2 py-1 text-sm rounded-lg text-dark focus-visible:ring-2 focus-visible:ring-primary bg-tertiary top-4 right-4 hover:bg-tertiary/80"
          >
            View Painting <FaArrowRight />
          </Link>
          <AnimatePresence mode="wait">
            {image && (
              <motion.div
                key={currentPaintingsIndex}
                initial={{ scale: 0.99 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.99 }}
                transition={{ type: "spring" }}
                className="relative w-full h-full aspect-square lg:aspect-video drop-shadow-2xl rounded-2xl bg-dark/20"
              >
                <picture>
                  <source media="(min-width: 1024px)" srcSet={desktop} />
                  <source media="(min-width: 0px)" srcSet={mobile} />
                  <img
                    {...rest}
                    style={{ width: "100%", height: "100%" }}
                    className="object-cover rounded-2xl"
                  />
                </picture>
              </motion.div>
            )}
          </AnimatePresence>
          <section className="absolute bottom-0 z-10 flex items-center justify-center w-full gap-4 p-4 capitalize xl:col-start-5 col-span-full xl:gap-6 xl:justify-center">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center p-3 font-medium transition-all duration-300 rounded-lg shadow-lg text-dark bg-tertiary hover:bg-tertiary/90 hover:shadow-xl"
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
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center px-6 py-3 font-medium text-white transition-all duration-300 rounded-lg shadow-lg bg-primary hover:bg-primary/90 hover:shadow-xl"
              >
                View Gallery
              </motion.div>
            </Link>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center p-3 font-medium transition-all duration-300 rounded-lg shadow-lg text-dark bg-tertiary hover:bg-tertiary/90 hover:shadow-xl"
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
