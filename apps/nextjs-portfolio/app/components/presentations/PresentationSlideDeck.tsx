'use client';

import { useRef, useState } from 'react';
import { IntroPresentation } from '@/app/components/three-d/IntroPresentation';
import { PresentationControls } from '@/app/components/three-d/PresentationControls';
import type { PresentationSlide } from '@/app/three-d/types';

type PresentationSlideDeckProps = {
  slides: PresentationSlide[] | null;
  /** Hide prev/next when only browsing slides (no technical section skip). */
  showSkipControl?: boolean;
};

export function PresentationSlideDeck({
  slides,
  showSkipControl = false,
}: PresentationSlideDeckProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const technicalDeckRef = useRef<HTMLDivElement>(null);
  const technicalSeparatorRef = useRef<HTMLElement>(null);
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

  if (!slides?.length) {
    return (
      <div className='flex h-full min-h-[50vh] items-center justify-center px-6 text-center text-foreground-muted'>
        This presentation has no published slides yet.
      </div>
    );
  }

  return (
    <>
      <div
        ref={mainRef}
        className='presentation-scroll h-[100dvh] w-full overflow-x-hidden overflow-y-auto snap-y snap-mandatory bg-background text-foreground overscroll-y-contain'
      >
        <IntroPresentation
          mainRef={mainRef}
          technicalDeckRef={technicalDeckRef}
          technicalSeparatorRef={technicalSeparatorRef}
          slides={slides}
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
