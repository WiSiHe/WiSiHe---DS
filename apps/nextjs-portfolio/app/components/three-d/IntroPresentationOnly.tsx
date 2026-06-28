'use client';

import { useCallback, useState } from 'react';
import type { PresentationSlide } from '../../three-d/types';
import { IntroPresentation } from './IntroPresentation';

interface IntroPresentationOnlyProps {
  slides: PresentationSlide[] | null;
}

export function IntroPresentationOnly({ slides }: IntroPresentationOnlyProps) {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  const scrollRootRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setScrollRoot(node);
    }
  }, []);

  return (
    <div
      ref={scrollRootRef}
      className='w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory bg-background text-foreground overflow-x-hidden max-w-full'
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Intro Presentation Section Only */}
      <div className='snap-start h-[100dvh] shrink-0'>
        <IntroPresentation scrollRoot={scrollRoot} slides={slides} />
      </div>
    </div>
  );
}
