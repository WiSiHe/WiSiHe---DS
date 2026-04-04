'use client';

import { useGSAP } from '@gsap/react';
import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

import {
  getHeroStrokeColors,
  HERO_BRUSH_STROKE_WIDTH_HOVER,
  HERO_BRUSH_STROKE_WIDTH_REST,
  HeroPaintingSvgHover,
  initHeroSvgStrokePaths,
} from './HeroPaintingSvgHover';
import HeroScrollIndicator from './HeroScrollIndicator';

gsap.registerPlugin(useGSAP);

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

// Positions that avoid the center text area but are closer together
// Center text area: approximately 35-65% vertical, 30-70% horizontal
// Mobile positions can use space below text (65%+ vertical)
const FIXED_POSITIONS_DESKTOP = [
  { top: '15%', left: '20%', rotation: -12, scale: 0.9 },
  { top: '20%', left: '80%', rotation: 15, scale: 0.85 },
  { top: '30%', left: '15%', rotation: -5, scale: 1.0 },
  { top: '25%', left: '85%', rotation: 10, scale: 0.95 },
  { top: '75%', left: '20%', rotation: -15, scale: 0.85 },
  { top: '80%', left: '80%', rotation: 5, scale: 1.0 },
  { top: '12%', left: '50%', rotation: -8, scale: 0.9 },
  { top: '88%', left: '50%', rotation: 12, scale: 0.9 },
];

// Mobile positions - use space both above and below text
// Text area is approximately 35-65% vertical, so positions above 35% and below 65%
const FIXED_POSITIONS_MOBILE = [
  // Above text (top area)
  { top: '10%', left: '15%', rotation: -12, scale: 0.8 },
  { top: '15%', left: '85%', rotation: 15, scale: 0.75 },
  { top: '8%', left: '50%', rotation: -8, scale: 0.8 },
  { top: '20%', left: '20%', rotation: -10, scale: 0.75 },
  { top: '25%', left: '80%', rotation: 12, scale: 0.8 },
  { top: '12%', left: '30%', rotation: -5, scale: 0.75 },
  // Below text (bottom area)
  { top: '70%', left: '20%', rotation: -15, scale: 0.8 },
  { top: '75%', left: '80%', rotation: 5, scale: 0.75 },
  { top: '85%', left: '50%', rotation: 12, scale: 0.8 },
  { top: '80%', left: '15%', rotation: -8, scale: 0.75 },
  { top: '78%', left: '85%', rotation: 10, scale: 0.8 },
  { top: '88%', left: '30%', rotation: -12, scale: 0.75 },
];

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const svgHoverTlsRef = useRef<Map<number, gsap.core.Timeline>>(new Map());

  useLayoutEffect(() => {
    initHeroSvgStrokePaths(containerRef.current);
  }, [paintings]);

  useEffect(() => {
    return () => {
      svgHoverTlsRef.current.forEach(tl => tl.kill());
      svgHoverTlsRef.current.clear();
    };
  }, []);

  // Hide scroll indicator after user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;

      // Hide after scrolling 100px or when hero section is out of view
      if (scrollY > 100 || containerRect.bottom < 0) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (!paintings || paintings.length === 0) return;

      const images = imagesRef.current?.children;
      if (!images) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: '(max-width: 767px)',
          isTablet: '(min-width: 768px) and (max-width: 1023px)',
          isDesktop: '(min-width: 1024px)',
        },
        context => {
          const { isMobile, isTablet } = context.conditions || {};
          const tl = gsap.timeline();
          const isDev = process.env.NODE_ENV === 'development';
          const hasPlayed = sessionStorage.getItem('hero-splash-played');

          // On mobile: 12 images (6 above, 6 below text)
          // On tablet: 7 images
          // On desktop: 8 images
          let visibleImages: Element[];
          if (isMobile) {
            visibleImages = Array.from(images).slice(0, 12);
          } else if (isTablet) {
            visibleImages = Array.from(images).slice(0, 7);
          } else {
            visibleImages = Array.from(images).slice(0, 8);
          }

          if (hasPlayed && !isDev) {
            // --- FAST TRACK: Set final state immediately ---

            // Hide loader
            gsap.set(loaderRef.current, { display: 'none' });

            // Show Text
            if (textRef.current) {
              gsap.set(textRef.current.children, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              });
            }

            // Position Images & Start Float
            const positions = isMobile ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;
            visibleImages.forEach((img, i) => {
              // Only use positions up to the number of visible images (don't cycle)
              const pos = (positions[i] ?? positions[i % positions.length])!;

              // Set to final position
              gsap.set(img, {
                left: pos.left,
                top: pos.top,
                rotation: pos.rotation,
                scale: pos.scale,
                xPercent: -50,
                yPercent: -50,
                opacity: 1,
                zIndex: 1,
              });

              // Start Float
              gsap.to(img, {
                y: `+=${Math.random() * 20 + 10}`,
                x: `+=${Math.random() * 10 - 5}`,
                rotation: `+=${Math.random() * 6 - 3}`,
                duration: Math.random() * 3 + 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.1,
              });
            });

            // Enable hover effects immediately for fast track
            setIsAnimationComplete(true);
          } else {
            // --- FULL ANIMATION SEQUENCE ---

            if (!isDev) {
              sessionStorage.setItem('hero-splash-played', 'true');
            }

            // 1. Loader Animation & Stacking
            const progressObj = { value: 0 };

            tl.to(progressObj, {
              value: 100,
              duration: 2.5, // Slightly longer for better stacking effect
              ease: 'power2.inOut',
              onUpdate: () => setProgress(Math.round(progressObj.value)),
            });

            // Stack images in center (same position as loader), starting from bottom and stacking upward
            visibleImages.forEach((img, i) => {
              // Calculate stacking offset - centered horizontally, stacking upward vertically
              const stackOffsetX = 0; // Keep centered horizontally
              const stackOffsetY = -(i * 15); // Stack upward from center (negative Y moves up)
              const stackRotation = (i % 3) * 3 - 3; // Small rotation: -3, 0, 3
              const stackScale = 1 - i * 0.03; // Slightly smaller as they stack

              tl.fromTo(
                img,
                {
                  scale: 0,
                  opacity: 0,
                  xPercent: -50,
                  yPercent: -50,
                  left: '50%',
                  top: '50%', // Start at center (same as loader)
                  rotation: 0,
                  zIndex: i + 1, // First image has lowest z-index, last has highest (on top)
                },
                {
                  scale: stackScale,
                  opacity: 1,
                  x: stackOffsetX,
                  y: stackOffsetY, // Stack upward from center
                  rotation: stackRotation,
                  duration: 0.6,
                  ease: 'back.out(1.4)',
                },
                0.1 + i * 0.12, // Stagger the stacking
              );
            });

            // Fade out loader
            tl.to(
              loaderRef.current,
              {
                opacity: 0,
                y: -50,
                filter: 'blur(10px)',
                duration: 0.5,
                ease: 'power2.in',
                display: 'none',
              },
              '-=0.5',
            );

            tl.addLabel('explode', '+=0.1');

            // 2. Explode & Float
            const positions = isMobile ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;
            visibleImages.forEach((img, i) => {
              // Only use positions up to the number of visible images (don't cycle)
              const pos = (positions[i] ?? positions[i % positions.length])!;

              tl.to(
                img,
                {
                  left: pos.left,
                  top: pos.top,
                  rotation: pos.rotation,
                  scale: pos.scale,
                  xPercent: -50,
                  yPercent: -50,
                  duration: 1.2, // Faster explosion
                  ease: 'back.out(2)', // Springier
                  zIndex: 1,
                },
                'explode',
              );

              gsap.to(img, {
                y: `+=${Math.random() * 20 + 10}`,
                x: `+=${Math.random() * 10 - 5}`,
                rotation: `+=${Math.random() * 6 - 3}`,
                duration: Math.random() * 3 + 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 3 + i * 0.1,
              });
            });

            // 3. Text Entrance (After explosion)
            if (textRef.current) {
              const textElements = textRef.current.children;
              tl.fromTo(
                textElements,
                { opacity: 0, y: 30, filter: 'blur(5px)' },
                {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  duration: 1,
                  stagger: 0.15,
                  ease: 'power3.out',
                },
                '-=0.4', // Overlap slightly with end of explosion
              );
            }

            // 4. Enable hover effects after all animations complete
            tl.call(() => {
              setIsAnimationComplete(true);
            });
          }
        },
      );
    },
    { scope: containerRef, dependencies: [paintings] },
  );

  const handleMouseEnter = contextSafe((index: number) => {
    // Only allow hover effects after animation is complete
    if (!isAnimationComplete) return;

    const imageElements = imagesRef.current?.children;
    if (!imageElements) return;

    const link = imageElements[index] as HTMLElement;

    // Determine which position set to use based on window width
    const isMobileCheck = typeof window !== 'undefined' && window.innerWidth < 768;
    const positions = isMobileCheck ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;
    const baseScale = positions[index % positions.length]!.scale;

    svgHoverTlsRef.current.get(index)?.kill();
    const tl = gsap.timeline();
    svgHoverTlsRef.current.set(index, tl);

    const paths = link.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
    paths.forEach(path => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          attr: { 'stroke-width': HERO_BRUSH_STROKE_WIDTH_HOVER },
          duration: 1.5,
          ease: 'power2.out',
        },
        0,
      );
    });

    const titleEl = link.querySelector('[data-hero-title]');
    if (titleEl) {
      tl.fromTo(
        titleEl,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        0.25,
      );
    }

    tl.to(
      link,
      {
        scale: baseScale * 1.2,
        zIndex: 20,
        duration: 0.5,
        ease: 'power2.out',
      },
      0,
    );
  });

  const handleMouseLeave = contextSafe(() => {
    // Only allow hover effects after animation is complete
    if (!isAnimationComplete) return;

    // Reset hovered image to its base position
    const imageElements = imagesRef.current?.children;
    if (!imageElements) return;

    // Determine which position set to use (we'll check if mobile by checking window width)
    const isMobileCheck = typeof window !== 'undefined' && window.innerWidth < 768;
    const positions = isMobileCheck ? FIXED_POSITIONS_MOBILE : FIXED_POSITIONS_DESKTOP;

    Array.from(imageElements).forEach((img, i) => {
      const baseScale = positions[i % positions.length]!.scale;
      const currentZ = gsap.getProperty(img, 'zIndex');

      // Only reset if this image was hovered (zIndex > 1)
      if (typeof currentZ === 'number' && currentZ > 1) {
        svgHoverTlsRef.current.get(i)?.kill();
        svgHoverTlsRef.current.delete(i);

        const link = img as HTMLElement;
        const paths = link.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
        paths.forEach(path => {
          const len = path.getTotalLength();
          gsap.to(path, {
            strokeDashoffset: len,
            attr: { 'stroke-width': HERO_BRUSH_STROKE_WIDTH_REST },
            duration: 1,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });

        const titleEl = link.querySelector('[data-hero-title]');
        if (titleEl) {
          gsap.to(titleEl, {
            opacity: 0,
            y: 6,
            duration: 0.35,
            ease: 'power2.in',
            overwrite: 'auto',
          });
        }

        gsap.to(img, {
          scale: baseScale,
          zIndex: 1,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });
  });

  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  return (
    <section
      ref={containerRef}
      className='relative flex min-h-lvh w-full items-center justify-center transition-colors duration-500 bg-background-subtle'
    >
      {/* Loader */}
      <div
        ref={loaderRef}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none'
      >
        <div className='text-9xl font-black font-mono tracking-tighter text-white mix-blend-difference drop-shadow-2xl'>
          {progress}%
        </div>
      </div>

      {/* Central Text Content */}
      <div
        ref={textRef}
        className='relative z-50 flex flex-col items-center text-center p-8 max-w-2xl pointer-events-none'
      >
        <p className='text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 opacity-0 text-foreground-subtle'>
          My name is
        </p>
        <h1 className='text-7xl md:text-9xl font-serif font-black tracking-tighter mb-6 leading-none opacity-0 text-foreground'>
          Henrik
        </h1>
        <p className='text-lg md:text-xl font-medium opacity-0 max-w-md leading-relaxed text-foreground-subtle'>
          I&apos;m a design engineer, painter and a maker.
          <br />
          Explore my work.
        </p>

        <div className='mt-8 pointer-events-auto opacity-0'>
          <Link
            href='/paintings'
            className='inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-accent-contrast font-bold tracking-wide transition-all hover:scale-105 hover:bg-accent-hover shadow-lg'
          >
            View Gallery
          </Link>
        </div>
      </div>

      {/* Floating Images Container */}
      <div
        ref={imagesRef}
        className='absolute inset-0 pointer-events-none max-w-[1776px] mx-auto pt-10'
      >
        {paintings?.map((painting, index) => {
          const { image, altText, slug, title } = painting;
          if (!image) return null;

          const imageUrl = urlForImage(image)?.width(800).auto('format').quality(85).url() || '';

          // Deterministic random-like properties based on index
          const aspectRatios = ['aspect-square', 'aspect-video', 'aspect-[3/4]', 'aspect-[4/5]'];
          const sizes = [
            'w-48 md:w-80 lg:max-w-[20vw]',
            'w-56 md:w-96 lg:max-w-[22vw]',
            'w-40 md:w-64 lg:max-w-[18vw]',
            'w-52 md:w-80 lg:max-w-[20vw]',
          ];
          // Optimize LCP: Prioritize the first few images
          const isPriority = index < 4;

          const aspectRatio = aspectRatios[index % aspectRatios.length];
          const size = sizes[index % sizes.length];

          // Show paintings: mobile (12), tablet (7), desktop (8)
          let visibilityClass = 'hidden';
          if (index < 7) {
            // Show on all devices (mobile, tablet, desktop)
            visibilityClass = 'block';
          } else if (index === 7) {
            // Show on mobile and desktop, hide on tablet
            visibilityClass = 'block md:hidden lg:block';
          } else if (index < 12) {
            // Show on mobile only (images 8-11)
            visibilityClass = 'block md:hidden';
          }

          return (
            <Link
              key={painting._id}
              href={`paintings/${slug}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              // Initial state: centered
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 ${size} ${aspectRatio} ${visibilityClass} pointer-events-auto group opacity-0 will-change-transform`}
            >
              <div className='h-full w-full rounded-lg shadow-2xl'>
                <div className='relative isolate h-full w-full overflow-hidden rounded-lg'>
                  <Image
                    src={imageUrl}
                    alt={altText || 'Painting'}
                    fill
                    priority={isPriority}
                    className='object-cover'
                    sizes='(max-width: 768px) 40vw, 30vw'
                  />
                  <HeroPaintingSvgHover {...getHeroStrokeColors(index)} title={title} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <HeroScrollIndicator show={showScrollIndicator} />
    </section>
  );
};

export default HeroImageSection;
