"use client";

import { HomePageQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import { motion } from "motion/react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>["showcasePaintings"] | null;
};

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const constraintsRef = useRef(null);
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

  const common = {
    alt: altText || "Painting",
    fill: "true",
    className: "object-cover",
  };

  // Optimized sizes for different viewports
  const sizes = {
    desktop: { width: 1920, height: 1080, quality: 80 },
    laptop: { width: 1440, height: 810, quality: 75 },
    tablet: { width: 1024, height: 576, quality: 70 },
    mobile: { width: 800, height: 450, quality: 75 },
    smallMobile: { width: 400, height: 225, quality: 70 },
  };

  // Only generate srcSets for the current viewport size
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const currentSize = isMobile ? sizes.mobile : sizes.desktop;

  const {
    props: { srcSet },
  } = getImageProps({
    ...common,
    quality: currentSize.quality,
    fill: true,
    priority: true,
    fetchPriority: "high",
    src:
      urlForImage(image)
        ?.width(currentSize.width)
        .height(currentSize.height)
        .auto("format")
        .url() || "",
  });

  return (
    <motion.section
      ref={constraintsRef}
      className="relative flex ring flex-col items-end justify-center w-full px-4 py-24 h-fit md:px-10 lg:min-h-[85vh] xl:justify-center xl:min-h-[85vh] lg:py-10 bg-dark overflow-clip"
    >
      <img
        src={lqip || ""}
        alt=""
        className="absolute inset-0 object-cover w-full h-full scale-105 blur-2xl md:blur-3xl"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />

      <div className="relative z-10 flex flex-col items-start w-full gap-4 mx-auto max-w-(--breakpoint-2xl) xl:grid xl:grid-cols-12 xl:pt-32 xl:items-start">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="col-span-full xl:col-span-2"
        >
          <p className="text-white opacity-50 mix-blend-difference">
            My name is
          </p>
          <motion.h1
            className="text-4xl font-black text-white opacity-50 mix-blend-difference"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Henrik
          </motion.h1>
          <p className="text-white opacity-50 mix-blend-difference">
            I'm a design engineer, painter and a maker, here are some of my
            paintings, please take a gander.
          </p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full col-span-full xl:col-span-10 xl:col-start-3"
        >
          <Link
            key={currentPaintingsIndex + "painting-link"}
            href={`paintings/${slug}`}
            aria-label="View painting"
            className="absolute z-10 flex items-center gap-2 px-2 py-1 text-sm rounded-lg text-dark focus-visible:ring-2 focus-visible:ring-primary bg-tertiary top-4 right-4 hover:bg-tertiary/80"
          >
            View Painting <FaArrowRight />
          </Link>
          <motion.div
            key={currentPaintingsIndex}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ type: "spring" }}
            className="relative w-full h-full aspect-square drop-shadow-2xl lg:aspect-video rounded-2xl bg-dark/20"
          >
            {image && (
              <picture className="w-full h-full rounded-2xl overflow-clip">
                <img
                  {...common}
                  className="object-cover w-full h-full overflow-clip rounded-2xl"
                  srcSet={srcSet}
                  src={
                    urlForImage(image)
                      ?.width(currentSize.width)
                      .height(currentSize.height)
                      .auto("format")
                      .quality(currentSize.quality)
                      .url() || ""
                  }
                  alt={altText || "Image"}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  sizes="100vw"
                />
              </picture>
            )}
          </motion.div>

          <section className="z-10 flex items-center justify-between w-full gap-4 pt-6 pb-10 capitalize xl:col-start-5 col-span-full xl:gap-6 xl:justify-center">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring" }}
              className="p-3 text-white rounded-lg bg-primary"
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
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white transition-all duration-300 rounded-lg shadow-lg bg-primary hover:bg-primary/90 hover:shadow-xl"
              >
                View Gallery
              </motion.div>
            </Link>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring" }}
              className="p-3 text-white rounded-lg bg-primary"
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
