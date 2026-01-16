'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThreeDHero } from '../components/ThreeD/ThreeDHero';
import { IntroPresentation } from '../components/ThreeD/IntroPresentation';
import { SourcesSection } from '../components/ThreeD/SourcesSection';
import { StructuredData } from '../components/ThreeD/StructuredData';
import { TechnicalSeparator } from '../components/ThreeD/TechnicalSeparator';
import { TechnicalDeckSkeleton } from '../components/ThreeD/Technical/TechnicalDeckSkeleton';
import type { PresentationSlide } from './types';

const TechnicalDeck = dynamic(
  () =>
    import('../components/ThreeD/Technical/TechnicalDeck').then((mod) => ({
      default: mod.TechnicalDeck,
    })),
  {
    ssr: false,
    loading: () => <TechnicalDeckSkeleton />,
  }
);

export function ThreeDSlideDeckClient({ slides }: { slides: PresentationSlide[] | null }) {
  const technicalDeckRef = useRef<HTMLDivElement>(null);
  const technicalSeparatorRef = useRef<HTMLElement>(null);
  const [shouldLoadTechnical, setShouldLoadTechnical] = useState(false);
  const [shouldPreloadTechnical, setShouldPreloadTechnical] = useState(false);

  // Preload TechnicalDeck earlier - when user is halfway through intro presentation
  // This reduces the CSR bailout impact by loading the component before it's needed
  useEffect(() => {
    if (!technicalSeparatorRef.current || shouldPreloadTechnical) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Start preloading when separator becomes visible (user is approaching technical section)
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setShouldPreloadTechnical(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '400px' } // Very early preload - 400px before visible
    );

    observer.observe(technicalSeparatorRef.current);
    return () => observer.disconnect();
  }, [shouldPreloadTechnical]);

  // IntersectionObserver to load TechnicalDeck when user approaches the section
  // Now we can load it immediately if preloaded, or wait for intersection
  useEffect(() => {
    if (!technicalDeckRef.current || shouldLoadTechnical) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setShouldLoadTechnical(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '300px' } // Increased from 200px for earlier loading
    );

    observer.observe(technicalDeckRef.current);
    return () => observer.disconnect();
  }, [shouldLoadTechnical]);

  // Preload the component module when preload flag is set
  useEffect(() => {
    if (shouldPreloadTechnical && !shouldLoadTechnical) {
      // Preload the dynamic import
      import('../components/ThreeD/Technical/TechnicalDeck').catch(() => {
        // Silently handle preload errors
      });
    }
  }, [shouldPreloadTechnical, shouldLoadTechnical]);

  return (
    <>
      <StructuredData />
      <main
        className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground overflow-x-hidden"
        style={{
          scrollBehavior: 'smooth',
          // Performance optimizations for smooth scrolling
          willChange: 'scroll-position',
          // Prevent scroll chaining to improve performance
          overscrollBehavior: 'contain',
          // Use GPU acceleration for scrolling
          transform: 'translateZ(0)',
        }}
      >
        {/* Hero Section */}
        <section className="snap-start shrink-0 h-screen w-full relative">
          <ThreeDHero />
        </section>

        {/* Intro Presentation - Renders multiple snap-start slides internally */}
        <IntroPresentation
          technicalDeckRef={technicalDeckRef}
          technicalSeparatorRef={technicalSeparatorRef}
          slides={slides}
        />

        {/* Technical Separator */}
        <TechnicalSeparator ref={technicalSeparatorRef} />

        {/* Technical Deck */}
        <div
          ref={technicalDeckRef}
          className="snap-start shrink-0 h-screen w-full relative"
          style={{
            // Performance optimizations for the technical deck container
            contentVisibility: shouldLoadTechnical ? 'visible' : 'auto',
            contain: 'layout style paint',
            willChange: shouldLoadTechnical ? 'auto' : 'scroll-position',
          }}
        >
          {shouldLoadTechnical ? <TechnicalDeck /> : <TechnicalDeckSkeleton />}
        </div>

        {/* Sources Section */}
        <div className="snap-start shrink-0 min-h-screen w-full relative">
          <SourcesSection />
        </div>
      </main>
    </>
  );
}
