'use client';

import { AnimatePresence, motion } from 'motion/react';
import React, { useMemo } from 'react';
import { presentationSlides as fallbackSlides } from '../../three-d/presentationSlides';
import type { PresentationSlide } from '../../three-d/types';
import { ScrollIndicator } from '../ScrollIndicator';
import { GridBackground } from './GridBackground';
import { usePresentationLogic } from './hooks/usePresentationLogic';
import { ContentSlide } from './Slides/ContentSlide';
import { SeparatorSlide } from './Slides/SeparatorSlide';
import { TitleSlide } from './Slides/TitleSlide';

export const IntroPresentation = React.memo(function IntroPresentation({
  mainRef,
  technicalDeckRef,
  technicalSeparatorRef,
  slides,
  onPresentationStateChange,
}: {
  mainRef?: React.RefObject<HTMLElement | null>;
  technicalDeckRef?: React.RefObject<HTMLDivElement | null>;
  technicalSeparatorRef?: React.RefObject<HTMLElement | null>;
  slides?: PresentationSlide[] | null;
  onPresentationStateChange?: (state: {
    currentSlide: number;
    totalSlides: number;
    isTechnicalSectionVisible: boolean;
    isScrolled: boolean;
    onNext: () => void;
    onPrev: () => void;
    onScrollToTop: () => void;
    onSkipToCoolPart: () => void;
  }) => void;
}) {
  const presentationSlides = slides && slides.length > 0 ? slides : fallbackSlides;

  const {
    currentSlide,
    showCategoryTransition,
    isTechnicalSectionVisible,
    isScrolled,
    containerRef,
    slideRefs,
    handleScrollToTop,
    handlePrevSlide,
    handleNextSlide,
    handleSkipToCoolPart,
  } = usePresentationLogic({
    slides: presentationSlides,
    mainRef,
    technicalDeckRef,
    technicalSeparatorRef,
  });

  // Memoize history slide indices calculation to avoid recalculation on every render
  const historySlideIndices = useMemo(
    () =>
      presentationSlides
        .map((slide, index) =>
          slide.category === 'History' && slide.type === 'content' ? index : null,
        )
        .filter((index): index is number => index !== null),
    [presentationSlides],
  );

  // Memoize current history slide index
  const currentHistorySlideIndex = useMemo(() => {
    const foundIndex = historySlideIndices.indexOf(currentSlide);
    return foundIndex >= 0 ? foundIndex : undefined;
  }, [historySlideIndices, currentSlide]);

  // Memoize category transition content
  const categoryTransitionContent = useMemo(() => {
    if (!showCategoryTransition || !presentationSlides[currentSlide]?.category) {
      return null;
    }
    return presentationSlides[currentSlide].category;
  }, [showCategoryTransition, presentationSlides, currentSlide]);

  // Expose presentation state to parent for controls rendering
  // Initialize with null-like values to ensure the first state is always emitted
  const prevStateRef = React.useRef({
    currentSlide: -1,
    totalSlides: -1,
    isTechnicalSectionVisible: false,
    isScrolled: false,
  });

  React.useEffect(() => {
    const prevState = prevStateRef.current;
    const hasChanged =
      prevState.currentSlide !== currentSlide ||
      prevState.totalSlides !== presentationSlides.length ||
      prevState.isTechnicalSectionVisible !== isTechnicalSectionVisible ||
      prevState.isScrolled !== isScrolled;

    if (hasChanged && onPresentationStateChange) {
      prevStateRef.current = {
        currentSlide,
        totalSlides: presentationSlides.length,
        isTechnicalSectionVisible,
        isScrolled,
      };
      onPresentationStateChange({
        currentSlide,
        totalSlides: presentationSlides.length,
        isTechnicalSectionVisible,
        isScrolled,
        onNext: handleNextSlide,
        onPrev: handlePrevSlide,
        onScrollToTop: handleScrollToTop,
        onSkipToCoolPart: handleSkipToCoolPart,
      });
    }
  }, [
    currentSlide,
    presentationSlides.length,
    isTechnicalSectionVisible,
    isScrolled,
    onPresentationStateChange,
    handleNextSlide,
    handlePrevSlide,
    handleScrollToTop,
    handleSkipToCoolPart,
    // Note: handlers are stable from usePresentationLogic, but we don't need them in deps
    // since we only update when the actual state values change
  ]);

  return (
    <>
      <ScrollIndicator currentSlide={currentSlide} totalSlides={presentationSlides.length} />

      {/* Optimized: Use initial={false} to prevent initial animation on mount */}
      <AnimatePresence mode='wait' initial={false}>
        {categoryTransitionContent && (
          <motion.div
            key={categoryTransitionContent}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className='fixed top-16 md:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none'
          >
            <div className='flex items-center gap-3 px-6 py-2.5 bg-surface-elevated border border-border rounded-full shadow-2xl'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-accent'></span>
              </span>
              <span className='text-sm font-medium text-foreground/90 uppercase tracking-widest text-[10px]'>
                {categoryTransitionContent}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {presentationSlides[currentSlide]?.title && (
          <span>
            Slide {currentSlide + 1} of {presentationSlides.length}:{' '}
            {presentationSlides[currentSlide].title}
          </span>
        )}
      </div>

      <div ref={containerRef} className='w-full bg-background text-foreground relative'>
        {/* Single fixed GridBackground instance shared across all slides */}
        <GridBackground fixed />

        {presentationSlides.map((slideData, index) => {
          // Determine if slide is near viewport for content-visibility optimization
          const isNearViewport = Math.abs(index - currentSlide) <= 2;

          // Create stable key using type, title, and index for better React reconciliation
          const slideKey = `${slideData.type}-${slideData.title || ''}-${index}`;

          return (
            <div
              key={slideKey}
              ref={el => {
                slideRefs.current[index] = el;
              }}
              className='h-screen snap-start flex items-center justify-center pt-28 pb-6 px-6 md:pt-32 md:pb-12 md:px-12 lg:pt-36 lg:pb-16 lg:px-16 relative z-10 shrink-0 overflow-hidden max-w-full'
              style={{
                // Performance optimizations: content-visibility for off-screen slides
                contentVisibility: isNearViewport ? 'visible' : 'auto',
                // Contain layout, style, and paint to isolate rendering
                contain: 'layout style paint',
                // Use transform for better performance
                willChange: isNearViewport ? 'scroll-position' : 'auto',
              }}
            >
              <div className='w-full max-w-full flex items-center justify-center overflow-hidden'>
                {slideData.type === 'separator' && (
                  <SeparatorSlide slideData={slideData} index={index} />
                )}
                {slideData.type === 'title' && <TitleSlide slideData={slideData} index={index} />}
                {slideData.type === 'content' && (
                  <ContentSlide
                    slideData={slideData}
                    index={index}
                    currentHistorySlideIndex={currentHistorySlideIndex}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});
