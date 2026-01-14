'use client';

import { useRef } from 'react';
import { ThreeDHero } from '../components/ThreeD/ThreeDHero';
import { IntroPresentation } from '../components/ThreeD/IntroPresentation';
import { TechnicalDeck } from '../components/ThreeD/Technical/TechnicalDeck';
import { SourcesSection } from '../components/ThreeD/SourcesSection';
import { StructuredData } from '../components/ThreeD/StructuredData';
import { TechnicalSeparator } from '../components/ThreeD/TechnicalSeparator';
import type { PresentationSlide } from './types';

export function ThreeDSlideDeckClient({ slides }: { slides: PresentationSlide[] | null }) {
  const technicalDeckRef = useRef<HTMLDivElement>(null);
  const technicalSeparatorRef = useRef<HTMLElement>(null);

  return (
    <>
      <StructuredData />
      <main
        className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground overflow-x-hidden"
        style={{ scrollBehavior: 'smooth' }}
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
        <div ref={technicalDeckRef} className="snap-start shrink-0 h-screen w-full relative">
          <TechnicalDeck />
        </div>

        {/* Sources Section */}
        <div className="snap-start shrink-0 min-h-screen w-full relative">
          <SourcesSection />
        </div>
      </main>
    </>
  );
}
