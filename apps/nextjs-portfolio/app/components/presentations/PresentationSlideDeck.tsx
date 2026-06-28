'use client';

import { useCallback, useMemo, useState } from 'react';
import { IntroPresentation } from '@/app/components/three-d/IntroPresentation';
import { PresentationControls } from '@/app/components/three-d/PresentationControls';
import type { PresentationSlide } from '@/app/three-d/types';

type PresentationSlideDeckProps = {
  slides: PresentationSlide[] | null;
  /** Hide prev/next when only browsing slides (no technical section skip). */
  showSkipControl?: boolean;
  isWorkshopDeck?: boolean;
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

const parseTldrToPortableText = (text: string) => {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.map((line, idx) => {
    // Strip bullet markers (•, -, *)
    const cleanLine = line.replace(/^[•\-*]\s*/, '');
    const isBullet =
      line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || lines.length > 1;

    return {
      _type: 'block',
      _key: `tldr-block-${idx}`,
      style: 'normal',
      ...(isBullet && { listItem: 'bullet', level: 1 }),
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `tldr-span-${idx}`,
          marks: [],
          text: cleanLine,
        },
      ],
    };
  });
};

export function PresentationSlideDeck({
  slides,
  showSkipControl = false,
  isWorkshopDeck = false,
  tldr,
  tldrPosition = 'top',
}: PresentationSlideDeckProps) {
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

    const list: PresentationSlide[] = [];

    if (isWorkshopDeck) {
      list.push(HERO_SLIDE);
    }

    const tldrSlide: PresentationSlide = tldr
      ? {
          title: 'TL;DR Summary 📝',
          type: 'content',
          content: parseTldrToPortableText(tldr),
          slideDesign: 'bold',
          category: 'Summary',
        }
      : null!;

    const position = tldrPosition ?? 'top';

    // Top TL;DR: Insert as first slide (or second slide if there is a Hero slide)
    if (tldr && position === 'top') {
      if (isWorkshopDeck) {
        list.push(tldrSlide);
        list.push(...slides);
      } else {
        list.push(slides[0]!);
        list.push(tldrSlide);
        list.push(...slides.slice(1));
      }
    } else {
      list.push(...slides);
    }

    // Bottom TL;DR: Insert before final showcase slides or at the very end
    if (tldr && position === 'bottom') {
      list.push(tldrSlide);
    }

    if (isWorkshopDeck) {
      list.push(SEPARATOR_SLIDE, TECHNICAL_DECK_SLIDE, SOURCES_SLIDE);
    }

    return list;
  }, [slides, isWorkshopDeck, tldr, tldrPosition]);

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
        className='presentation-scroll h-[100dvh] w-full overflow-x-hidden overflow-y-auto snap-y snap-mandatory bg-background text-foreground overscroll-y-contain touch-pan-y'
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
          showSkipControl={showSkipControl ?? false}
        />
      ) : null}
    </>
  );
}
