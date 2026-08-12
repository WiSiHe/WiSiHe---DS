'use client';

import { useCallback, useMemo, useState } from 'react';
import { parseTldrToPortableText } from '@/lib/presentations/parseTldrToPortableText';
import type { PresentationSlide } from '@/lib/three-d/types';
import { IntroPresentation } from './IntroPresentation';
import { PresentationControls } from './PresentationControls';

type WorkshopPresentationSlideDeckProps = {
  slides: PresentationSlide[] | null;
  showSkipControl?: boolean;
  tldr?: string | null;
  tldrPosition?: 'top' | 'bottom' | null;
};

const HERO_SLIDE: PresentationSlide = {
  title: "Houston, we're coding 3D! 🚀",
  type: 'content',
  content: null,
  customComponent: 'ThreeDHero',
};

const SEPARATOR_SLIDE: PresentationSlide = {
  title: 'Technical Showcase',
  type: 'separator',
  content: null,
  customComponent: 'TechnicalSeparator',
};

const TECHNICAL_DECK_SLIDE: PresentationSlide = {
  title: 'Technical Showcase Showcase',
  type: 'content',
  content: null,
  customComponent: 'TechnicalDeck',
};

const SOURCES_SLIDE: PresentationSlide = {
  title: 'Sources & Resources',
  type: 'content',
  content: null,
  customComponent: 'SourcesSection',
};

export function WorkshopPresentationSlideDeck({
  slides,
  showSkipControl = false,
  tldr,
  tldrPosition = 'top',
}: WorkshopPresentationSlideDeckProps) {
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

  const scrollRootRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setScrollRoot(node);
    }
  }, []);

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

  const finalSlides = useMemo(() => {
    if (!slides?.length) return null;

    const list: PresentationSlide[] = [HERO_SLIDE];

    const tldrSlide: PresentationSlide | null = tldr
      ? {
          title: 'TL;DR Summary 📝',
          type: 'content',
          content: parseTldrToPortableText(tldr),
          slideDesign: 'bold',
          category: 'Summary',
        }
      : null;

    const position = tldrPosition ?? 'top';

    if (tldr && position === 'top' && tldrSlide) {
      list.push(tldrSlide, ...slides);
    } else {
      list.push(...slides);
    }

    if (tldr && position === 'bottom' && tldrSlide) {
      list.push(tldrSlide);
    }

    list.push(SEPARATOR_SLIDE, TECHNICAL_DECK_SLIDE, SOURCES_SLIDE);

    return list;
  }, [slides, tldr, tldrPosition]);

  if (!finalSlides?.length) {
    return (
      <div className='flex h-full min-h-[50vh] items-center justify-center px-6 text-center text-foreground-muted'>
        This presentation has no published slides yet.
      </div>
    );
  }

  return (
    <>
      <div
        ref={scrollRootRef}
        className='presentation-scroll h-[100dvh] w-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain bg-background text-foreground snap-y snap-mandatory'
      >
        <IntroPresentation
          scrollRoot={scrollRoot}
          slides={finalSlides}
          onPresentationStateChange={setPresentationState}
        />
      </div>

      {presentationState ? (
        <PresentationControls
          currentSlide={presentationState.currentSlide}
          totalSlides={presentationState.totalSlides}
          onNext={presentationState.onNext}
          onPrev={presentationState.onPrev}
          onScrollToTop={presentationState.onScrollToTop}
          onSkipToCoolPart={presentationState.onSkipToCoolPart}
          isVisible={!presentationState.isTechnicalSectionVisible}
          showSkipControl={showSkipControl}
        />
      ) : null}
    </>
  );
}
