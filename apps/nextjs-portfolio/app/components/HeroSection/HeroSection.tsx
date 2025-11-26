'use client';

import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

type HeroImageSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
};

// Pre-determined fixed positions (percentages) to ensure a balanced layout
// Avoiding the center area (approx 30% - 70% width/height)
const FIXED_POSITIONS = [
  { top: '5%', left: '5%', rotation: -12, scale: 0.9 },
  { top: '15%', left: '35%', rotation: 8, scale: 1.0 },
  { top: '8%', left: '80%', rotation: 15, scale: 0.85 },
  { top: '35%', left: '12%', rotation: -5, scale: 1.1 },
  { top: '45%', left: '88%', rotation: 10, scale: 0.95 },
  { top: '60%', left: '5%', rotation: -15, scale: 0.8 },
  { top: '75%', left: '20%', rotation: 5, scale: 1.05 },
  { top: '85%', left: '60%', rotation: -8, scale: 0.9 },
  { top: '70%', left: '90%', rotation: 12, scale: 0.85 },
  { top: '20%', left: '92%', rotation: -6, scale: 1.0 },
  { top: '90%', left: '10%', rotation: 20, scale: 0.95 },
  { top: '55%', left: '75%', rotation: -3, scale: 0.85 },
];

const HeroImageSection = ({ paintings }: HeroImageSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      if (!paintings || paintings.length === 0) return;

      const images = imagesRef.current?.children;
      if (!images) return;

      const tl = gsap.timeline();
      const isDev = process.env.NODE_ENV === 'development';
      const hasPlayed = sessionStorage.getItem('hero-splash-played');

      if (hasPlayed && !isDev) {
        // --- FAST TRACK: Set final state immediately ---
        
        // Hide loader
        gsap.set(loaderRef.current, { display: 'none' });

        // Show Text
        if (textRef.current) {
          gsap.set(textRef.current.children, { opacity: 1, y: 0, filter: 'blur(0px)' });
        }

        // Position Images & Start Float
        Array.from(images).forEach((img, i) => {
          const pos = FIXED_POSITIONS[i % FIXED_POSITIONS.length];
          
          // Set to final position
          gsap.set(img, {
            left: pos.left,
            top: pos.top,
            rotation: pos.rotation,
            scale: pos.scale,
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
            zIndex: 10,
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

      } else {
        // --- FULL ANIMATION SEQUENCE ---
        
        if (!isDev) {
          sessionStorage.setItem('hero-splash-played', 'true');
        }

        // 1. Loader Animation & Stacking
        const progressObj = { value: 0 };
        
        tl.to(progressObj, {
          value: 100,
          duration: 2.0, // Slightly faster load
          ease: 'power2.inOut',
          onUpdate: () => setProgress(Math.round(progressObj.value)),
        });

        Array.from(images).forEach((img, i) => {
          tl.fromTo(
            img,
            {
              scale: 0,
              opacity: 0,
              xPercent: -50,
              yPercent: -50,
              left: '50%',
              top: '50%',
              rotation: Math.random() * 10 - 5,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.2)',
            },
            0.2 + i * 0.15
          );
        });

        // Fade out loader
        tl.to(loaderRef.current, {
          opacity: 0,
          y: -50,
          filter: 'blur(10px)',
          duration: 0.5,
          ease: 'power2.in',
          display: 'none',
        }, '-=0.5');

        tl.addLabel('explode', '+=0.1');

        // 2. Explode & Float
        Array.from(images).forEach((img, i) => {
          const pos = FIXED_POSITIONS[i % FIXED_POSITIONS.length];
          
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
              zIndex: 10,
            },
            'explode'
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
              ease: 'power3.out' 
            },
            '-=0.4' // Overlap slightly with end of explosion
          );
        }
      }
    },
    { scope: containerRef, dependencies: [paintings] }
  );

  const handleMouseEnter = contextSafe((index: number) => {
    const images = imagesRef.current?.children;
    if (!images) return;

    // Animate hovered image
    gsap.to(images[index], {
      scale: 1.2,
      zIndex: 50,
      filter: 'grayscale(0%) blur(0px)',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Animate other images
    Array.from(images).forEach((img, i) => {
      if (i !== index) {
        const baseScale = FIXED_POSITIONS[i % FIXED_POSITIONS.length].scale;
        
        // If this image was previously high (hovered), drop it slightly 
        // so it doesn't fight the new target, but keep it above others
        const currentZ = gsap.getProperty(img, 'zIndex');
        if (typeof currentZ === 'number' && currentZ > 10) {
          gsap.set(img, { zIndex: 40 });
        }

        gsap.to(img, {
          scale: baseScale * 0.9,
          filter: 'grayscale(100%) blur(4px)',
          opacity: 0.4,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(img, { zIndex: 10 });
          }
        });
      }
    });
  });

  const handleMouseLeave = contextSafe(() => {
    const images = imagesRef.current?.children;
    if (!images) return;

    // Reset all images
    Array.from(images).forEach((img, i) => {
      const baseScale = FIXED_POSITIONS[i % FIXED_POSITIONS.length].scale;
      
      gsap.to(img, {
        scale: baseScale,
        filter: 'grayscale(0%) blur(0px)',
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(img, { zIndex: 10 });
        }
      });
    });
  });

  if (!paintings || paintings.length === 0) {
    return <div>No paintings available.</div>;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-surface-elevated)] via-[var(--color-background)] to-[var(--color-surface)] flex items-center justify-center transition-colors duration-500"
    >
      {/* Loader */}
      <div 
        ref={loaderRef}
        className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      >
        <div className="text-9xl font-black font-mono tracking-tighter text-[var(--color-text-primary)] blur-[0.5px]">
          {progress}%
        </div>
      </div>

      {/* Central Text Content */}
      <div
        ref={textRef}
        className="relative z-50 flex flex-col items-center text-center p-8 max-w-2xl pointer-events-none text-[var(--color-text-primary)]"
      >
        <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] mb-4 opacity-0 text-[var(--color-text-secondary)]">
          My name is
        </p>
        <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter mb-6 leading-none opacity-0 drop-shadow-2xl text-[var(--color-text-primary)]">
          Henrik
        </h1>
        <p className="text-lg md:text-xl font-medium opacity-0 max-w-md leading-relaxed drop-shadow-md text-[var(--color-text-secondary)]">
          I&apos;m a design engineer, painter and a maker.
          <br />
          Explore my work.
        </p>
        
        <div className="mt-8 pointer-events-auto opacity-0">
             <Link
            href="/paintings"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-bold tracking-wide transition-all hover:scale-105 hover:opacity-90 shadow-lg"
          >
            View Gallery
          </Link>
        </div>
      </div>

      {/* Floating Images Container */}
      <div ref={imagesRef} className="absolute inset-0 pointer-events-none">
        {paintings?.map((painting, index) => {
          const { image, altText, slug } = painting;
          if (!image) return null;

          const imageUrl =
            urlForImage(image)?.width(800).auto('format').quality(85).url() || '';

          // Deterministic random-like properties based on index
          const aspectRatios = ['aspect-square', 'aspect-video', 'aspect-[3/4]', 'aspect-[4/5]'];
          const sizes = [
            'w-48 md:w-80', 
            'w-56 md:w-96', 
            'w-40 md:w-64', 
            'w-52 md:w-80'
          ];
          // Optimize LCP: Prioritize the first few images
          const isPriority = index < 4;
          
          const aspectRatio = aspectRatios[index % aspectRatios.length];
          const size = sizes[index % sizes.length];

          return (
            <Link
              key={painting._id}
              href={`paintings/${slug}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              // Initial state: centered
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${size} ${aspectRatio} pointer-events-auto group opacity-0 will-change-transform`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={altText || 'Painting'}
                  fill
                  priority={isPriority}
                  className="object-cover rounded-lg shadow-2xl"
                  sizes="(max-width: 768px) 40vw, 30vw"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default HeroImageSection;
