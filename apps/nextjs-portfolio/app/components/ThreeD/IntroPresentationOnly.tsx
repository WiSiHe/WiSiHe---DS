'use client';

import { useRef } from 'react';
import type { PresentationSlide } from '../../three-d/types';
import { IntroPresentation } from './IntroPresentation';

interface IntroPresentationOnlyProps {
  slides: PresentationSlide[] | null;
}

export function IntroPresentationOnly({ slides }: IntroPresentationOnlyProps) {
  // Create a dummy ref for technicalDeckRef (not used in intro-only view)
  const technicalDeckRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className='w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground overflow-x-hidden max-w-full'
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Intro Presentation Section Only */}
      <div className='snap-start h-screen shrink-0'>
        <IntroPresentation technicalDeckRef={technicalDeckRef} slides={slides} />
      </div>
    </main>
  );
}
