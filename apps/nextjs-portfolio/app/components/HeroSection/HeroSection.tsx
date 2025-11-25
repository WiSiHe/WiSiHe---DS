'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import IconLogo from '../icons/IconLogo';

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

// Random loading messages
const LOADING_MESSAGES = [
  "Welcome to Henrik's Creative Universe",
  'Crafting Digital Masterpieces',
  'Where Art Meets Technology',
  "Building Tomorrow's Experiences",
  'Creating Visual Stories',
  'Designing the Future',
  "Henrik's Portfolio Loading...",
  'Preparing Creative Magic',
  'Loading Artistic Vision',
  "Henrik's World Awaits",
];

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const [currentPaintingsIndex, setCurrentPaintingsIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
  );
  const containerRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLElement>(null);
  const imageSectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Custom stagger function using Perlin noise - Optimized to avoid layout thrashing
  const perlinStagger = (index: number) => {
    // We use window.innerWidth to determine grid layout
    // This is much faster than getBoundingClientRect() for every element
    const isDesktop = window.innerWidth >= 768;
    const cols = isDesktop ? 32 : 24;

    const col = index % cols;
    const row = Math.floor(index / cols);

    // Simple noise-like function using grid position
    const noise1 = Math.sin(col * 0.2) * Math.cos(row * 0.2);
    const noise2 = Math.sin(col * 0.1) * Math.cos(row * 0.1);
    const noise3 = Math.sin(col * 0.05) * Math.cos(row * 0.05);

    const combinedNoise = (noise1 + noise2 + noise3) / 3;
    const normalizedNoise = (combinedNoise + 1) / 2; // Normalize to 0-1

    return normalizedNoise * 1.5; // Spread over 1.5 seconds
  };

  // Handle splash screen state
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      // In dev, we always want to show it (or at least not hide it via the script)
      document.documentElement.classList.remove('splash-shown');
      return;
    }

    const hasShown = sessionStorage.getItem('hasShownSplash');
    if (hasShown) {
      setIsLoading(false);
    } else {
      sessionStorage.setItem('hasShownSplash', 'true');
    }
  }, []);

  // Loading animation
  useGSAP(
    () => {
      if (!loadingRef.current) return;

      if (!loadingRef.current) return;

      const tl = gsap.timeline();

      // Set initial loading state
      gsap.set(loadingRef.current, { opacity: 1 });
      gsap.set('.loading-name', { opacity: 0, y: 50, scale: 0.8 });
      gsap.set('.loading-logo', { scale: 0, rotation: 180, opacity: 0 });
      gsap.set('.loading-text', { opacity: 0, y: 20 });
      gsap.set('.loading-progress-container', { opacity: 0, y: 20 });
      gsap.set('.loading-bar', { scaleX: 0 });
      gsap.set('.loading-grid-cell', { opacity: 1, scale: 1 });

      // Loading sequence - start with logo
      tl.to('.loading-logo', {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.4)',
      })
        .to(
          '.loading-logo',
          {
            scale: 1.2,
            rotation: 5,
            duration: 0.4,
            ease: 'power2.out',
            yoyo: true,
            repeat: 2,
          },
          '-=0.5',
        )
        .to(
          '.loading-logo',
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.6)',
          },
          '-=0.2',
        )
        .to(
          '.loading-text',
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.6',
        )
        .to(
          '.loading-name',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(1, 0.4)',
          },
          '-=0.4',
        )
        .to(
          '.loading-progress-container',
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.8',
        )
        .to(
          '.loading-bar',
          {
            scaleX: 1,
            duration: 2,
            ease: 'power2.out',
          },
          '-=0.4',
        )
        // Fun removal sequence - each element disappears differently
        .to(
          '.loading-progress-container',
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          '-=0.2',
        )
        .to(
          '.loading-logo',
          {
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.8,
            ease: 'back.in(1.7)',
          },
          '-=0.1',
        )
        .to(
          '.loading-text',
          {
            y: -50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
          },
          '-=0.6',
        )
        .to(
          '.loading-name',
          {
            y: 100,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in',
          },
          '-=0.1',
        )
        // Then fragment the grid background with Perlin noise pattern
        .to(
          '.loading-grid-cell',
          {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: 'power2.out',
            stagger: perlinStagger,
          },
          '-=0.3',
        )
        // Finally fade out the entire container
        .to(
          loadingRef.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => setIsLoading(false),
          },
          '-=0.2',
        );
    },
    { scope: loadingRef },
  );

  // GSAP animations - Initial load
  useGSAP(
    () => {
      if (!paintings || paintings.length === 0 || isLoading) return;

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
      {isLoading && (
        <div
          ref={loadingRef}
          className="loading-screen fixed inset-0 z-50 flex flex-col items-center justify-center text-on-primary overflow-hidden"
        >
          {/* Grid background - pixel-like with perfect squares */}
          <div className="absolute inset-0 grid grid-cols-24 grid-rows-32 md:grid-cols-32 md:grid-rows-24">
            {Array.from({ length: 768 }, (_, i) => (
              <div key={i} className={`loading-grid-cell bg-black rounded-none`} />
            ))}
            {Array.from({ length: 768 }, (_, i) => (
              <div
                key={i + 768}
                className={`loading-grid-cell bg-black rounded-none hidden md:block`}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto px-8">
            {/* Top section */}
            <div className="flex flex-col items-center mb-16">
              <div className="loading-logo mb-8 drop-shadow-2xl opacity-0">
                <IconLogo className="w-16 h-16 text-on-primary" />
              </div>

              {/* Loading text */}
              <div className="loading-text text-lg font-medium mb-8 text-center text-on-primary opacity-0">
                {loadingMessage}
              </div>

              {/* Minimal progress bar */}
              <div className="loading-progress-container w-64 h-1 bg-secondary/30 rounded-full overflow-hidden opacity-0">
                <div className="loading-bar h-full bg-accent origin-left scale-x-0"></div>
              </div>
            </div>

            {/* Bottom section - Name */}
            <div className="loading-name text-4xl font-bold text-center text-on-primary tracking-tight opacity-0">
              HENRIK WILHELM SISSENER
            </div>
          </div>
        </div>
      )}

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
