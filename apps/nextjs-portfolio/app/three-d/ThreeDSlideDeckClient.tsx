'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { IntroPresentation } from '../components/three-d/IntroPresentation';
import { PresentationControls } from '../components/three-d/PresentationControls';
import { SourcesSection } from '../components/three-d/SourcesSection';
import { StructuredData } from '../components/three-d/StructuredData';
import { TechnicalDeckSkeleton } from '../components/three-d/Technical/TechnicalDeckSkeleton';
import { TechnicalSeparator } from '../components/three-d/TechnicalSeparator';
import { ThreeDHero } from '../components/three-d/ThreeDHero';
import type { PresentationSlide } from './types';

const TechnicalDeck = dynamic(
  () =>
    import('../components/three-d/Technical/TechnicalDeck').then(mod => ({
      default: mod.TechnicalDeck,
    })),
  {
    ssr: false,
    loading: () => <TechnicalDeckSkeleton />,
  },
);

export function ThreeDSlideDeckClient({
  slides,
}: Readonly<{ slides: PresentationSlide[] | null }>) {
  const mainRef = useRef<HTMLDivElement>(null);
  const technicalDeckRef = useRef<HTMLDivElement>(null);
  const technicalSeparatorRef = useRef<HTMLElement>(null);
  const [shouldLoadTechnical, setShouldLoadTechnical] = useState(false);
  const [shouldPreloadTechnical, setShouldPreloadTechnical] = useState(false);
  const [presentationState, setPresentationState] = useState<{
    currentSlide: number;
    totalSlides: number;
    isTechnicalSectionVisible: boolean;
    isScrolled: boolean;
    onNext: () => void;
    onPrev: () => void;
    onScrollToTop: () => void;
    onSkipToCoolPart: () => void;
  } | null>(null);

  // Preload TechnicalDeck earlier - when user is halfway through intro presentation
  // This reduces the CSR bailout impact by loading the component before it's needed
  useEffect(() => {
    if (!technicalSeparatorRef.current || shouldPreloadTechnical) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        // Start preloading when separator becomes visible (user is approaching technical section)
        if (entry?.isIntersecting && entry.intersectionRatio > 0.1) {
          setShouldPreloadTechnical(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }, // Very early preload - 400px before visible
    );

    observer.observe(technicalSeparatorRef.current);
    return () => observer.disconnect();
  }, [shouldPreloadTechnical]);

  // IntersectionObserver to load TechnicalDeck when user approaches the section
  // Now we can load it immediately if preloaded, or wait for intersection
  useEffect(() => {
    if (!technicalDeckRef.current || shouldLoadTechnical) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting && entry.intersectionRatio > 0.1) {
          setShouldLoadTechnical(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '300px' }, // Increased from 200px for earlier loading
    );

    observer.observe(technicalDeckRef.current);
    return () => observer.disconnect();
  }, [shouldLoadTechnical]);

  // Preload the component module when preload flag is set
  useEffect(() => {
    if (shouldPreloadTechnical && !shouldLoadTechnical) {
      // Preload the dynamic import
      import('../components/three-d/Technical/TechnicalDeck').catch(() => {
        // Silently handle preload errors
      });
    }
  }, [shouldPreloadTechnical, shouldLoadTechnical]);

  return (
    <>
      <StructuredData />
      <div
        ref={mainRef}
        className='presentation-scroll h-[100dvh] w-full overflow-x-hidden overflow-y-auto snap-y snap-proximity bg-background text-foreground overscroll-y-contain touch-pan-y'
      >
        {/* Hero Section */}
        <section className='snap-start shrink-0 h-screen w-full relative'>
          <ThreeDHero />
        </section>

        {/* Intro Presentation - Renders multiple snap-start slides internally */}
        <IntroPresentation
          mainRef={mainRef}
          technicalDeckRef={technicalDeckRef}
          technicalSeparatorRef={technicalSeparatorRef}
          slides={slides}
          onPresentationStateChange={setPresentationState}
        />

        {/* Technical Separator */}
        <TechnicalSeparator ref={technicalSeparatorRef} />

        {/* Technical Deck */}
        <div
          ref={technicalDeckRef}
          className='snap-start shrink-0 h-screen w-full relative'
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
        <div className='snap-start shrink-0 min-h-screen w-full relative'>
          <SourcesSection />
        </div>
      </div>

      {/* Presentation Controls — outside scroll container to avoid transform containing block issues */}
      {presentationState && (
        <PresentationControls
          currentSlide={presentationState.currentSlide}
          totalSlides={presentationState.totalSlides}
          onNext={presentationState.onNext}
          onPrev={presentationState.onPrev}
          onScrollToTop={presentationState.onScrollToTop}
          onSkipToCoolPart={presentationState.onSkipToCoolPart}
          isVisible={!presentationState.isTechnicalSectionVisible}
        />
      )}
    </>
  );
}
