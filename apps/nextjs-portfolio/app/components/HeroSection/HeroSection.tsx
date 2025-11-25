'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};



const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);

  const containerRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLElement>(null);
  const imageSectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);




  // GSAP animations - Initial load
  useGSAP(
    () => {
      if (!paintings || paintings.length === 0) return;

      const timeline = gsap.timeline();

      // Set initial states - image starts fullscreen
      const isMobile = window.innerWidth < 768;
      gsap.set(textSectionRef.current, { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(imageSectionRef.current, {
        opacity: 0,
        scale: 1.5, // Start larger than screen
        rotationY: 15,
        x: isMobile ? 0 : 100, // Only slide from right on larger screens
      });
      gsap.set(buttonsRef.current?.children || [], { opacity: 0, y: 30, scale: 0.8 });

      // Create more dynamic entrance animations - image first, then text
      timeline
        .to(imageSectionRef.current, {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          x: 0, // Reset x position
          duration: 1.5,
          ease: 'power3.out',
        })
        .to(
          textSectionRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.3)',
          },
          '-=0.3',
        ) // Start text animation slightly before image finishes
        .to(
          buttonsRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
              amount: 0.6,
              from: 'center',
            },
            ease: 'back.out(1.7)',
          },
          '-=0.5',
        );
    },
    { scope: containerRef, dependencies: [paintings] },
  );

  // Image transition animation
  useGSAP(
    () => {
      if (!imageRef.current) return;

      const tl = gsap.timeline();

      // Fade out current image
      tl.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power3.out',
      })
        // Fade in new image
        .to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        });
    },
    { scope: imageRef, dependencies: [currentPaintingsIndex] },
  );

  // Button hover effects
  useGSAP(
    () => {
      if (!buttonsRef.current) return;

      const buttons = buttonsRef.current?.querySelectorAll('button, div') || [];

      for (const button of buttons) {
        const handleMouseEnter = () => {
          gsap.to(button, {
            scale: 1.1,
            rotation: 2,
            duration: 0.4,
            ease: 'elastic.out(1, 0.3)',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
          });
        };

        const handleMouseDown = () => {
          gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
          });
        };

        const handleMouseUp = () => {
          gsap.to(button, {
            scale: 1.1,
            duration: 0.2,
            ease: 'elastic.out(1, 0.3)',
          });
        };

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
        button.addEventListener('mousedown', handleMouseDown);
        button.addEventListener('mouseup', handleMouseUp);
      }
    },
    { scope: buttonsRef },
  );

  // Memoize handlers to reduce re-renders - must be before early return
  const handleNextBackground = useCallback(() => {
    if (!paintings || paintings.length === 0) return;
    setCurrentPaintingsIndex(prevIndex => (prevIndex + 1) % paintings.length);
  }, [paintings]);

  const handlePreviousBackground = useCallback(() => {
    if (!paintings || paintings.length === 0) return;
    setCurrentPaintingsIndex(prevIndex => (prevIndex === 0 ? paintings.length - 1 : prevIndex - 1));
  }, [paintings]);

  // Get image props
  const getImageProps = () => {
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
  };

  const imageProps = getImageProps();

  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  const currentBackground = paintings[currentPaintingsIndex];
  const { image, slug } = currentBackground || {};
  const { lqip } = image || {};

  return (
    <>
      {/* Loading Screen */}


      <section
        ref={containerRef}
        className="relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 min-h-screen lg:pt-0 bg-surface overflow-clip"
      >
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

        <div className="relative z-10 flex flex-col items-start w-full gap-4 mx-auto max-w-screen-2xl xl:grid xl:grid-cols-12 xl:pt-32 xl:items-start">
          <section
            ref={textSectionRef}
            className="z-20 p-4 rounded-xl left-4 xl:p-4 xl:top-36 md:max-w-96 xl:absolute col-span-full xl:bg-black/40 xl:backdrop-blur-2xl text-white"
          >
            <p className="">My name is</p>
            <h1 className="text-4xl font-black">Henrik</h1>
            <p className="">
              I&apos;m a design engineer, painter and a maker, here are some of my paintings, please
              take a gander.
            </p>
          </section>
          <section
            ref={imageSectionRef}
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
            {image && imageProps && (
              <div
                ref={imageRef}
                key={currentPaintingsIndex}
                className="relative w-full h-full aspect-square lg:aspect-video drop-shadow-2xl rounded-2xl bg-surface/20 lg:max-h-[75vh]"
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
              </div>
            )}
            <section
              ref={buttonsRef}
              className="absolute bottom-0 z-10 flex items-center justify-center w-full gap-4 p-4 capitalize xl:col-start-5 col-span-full xl:gap-6 xl:justify-center"
            >
              <button
                className="flex items-center p-3 font-medium transition-colors duration-300 rounded-full shadow-lg text-on-primary bg-accent/80 backdrop-blur-2xl hover:bg-accent hover:shadow-xl"
                onClick={handlePreviousBackground}
                aria-label="Previous painting"
              >
                <FaChevronLeft />
              </button>
              <Link href="/paintings">
                <div className="flex items-center px-6 py-3 font-medium text-on-primary transition-colors duration-300 rounded-full shadow-lg bg-primary/80 backdrop-blur-2xl hover:bg-primary hover:shadow-xl">
                  View Gallery
                </div>
              </Link>
              <button
                className="flex items-center p-3 font-medium transition-colors duration-300 rounded-full shadow-lg text-on-primary bg-accent/80 backdrop-blur-2xl hover:bg-accent hover:shadow-xl"
                onClick={handleNextBackground}
                aria-label="Next painting"
              >
                <FaChevronRight />
              </button>
            </section>
          </section>
        </div>
      </section>
    </>
  );
};

export default HeroImageSection;
