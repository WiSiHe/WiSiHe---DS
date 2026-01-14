'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ScrollIndicator } from '../ScrollIndicator';
import { SeparatorSlide } from './Slides/SeparatorSlide';
import { TitleSlide } from './Slides/TitleSlide';
import { ContentSlide } from './Slides/ContentSlide';
import { presentationSlides as fallbackSlides } from '../../three-d/presentationSlides';
import { GridBackground } from './GridBackground';
import { PresentationControls } from './PresentationControls';
import type { PresentationSlide } from '../../three-d/types';
import { usePresentationLogic } from './hooks/usePresentationLogic';

export const IntroPresentation = ({
  technicalDeckRef,
  technicalSeparatorRef,
  slides,
}: {
  technicalDeckRef?: React.RefObject<HTMLDivElement | null>;
  technicalSeparatorRef?: React.RefObject<HTMLElement | null>;
  slides?: PresentationSlide[] | null;
}) => {
  const presentationSlides = slides && slides.length > 0 ? slides : fallbackSlides;

  const {
    currentSlide,
    showCategoryTransition,
    previousSlideIndex,
    isTechnicalSectionVisible,
    isScrolled,
    containerRef,
    slideRefs,
    handleSkipToCoolPart,
    handleScrollToTop,
    handlePrevSlide,
    handleNextSlide,
  } = usePresentationLogic({
    slides: presentationSlides,
    technicalDeckRef,
    technicalSeparatorRef,
  });

  // Calculate current history slide index (0-3) for progressive timeline animation
  const historySlideIndices = presentationSlides
    .map((slide, index) =>
      slide.category === 'History' && slide.type === 'content' ? index : null,
    )
    .filter((index): index is number => index !== null);

  const currentHistorySlideIndex =
    historySlideIndices.findIndex(index => index === currentSlide) >= 0
      ? historySlideIndices.findIndex(index => index === currentSlide)
      : undefined;

  return (
    <>
      <ScrollIndicator currentSlide={currentSlide} totalSlides={presentationSlides.length} />

      <AnimatePresence mode="wait">
        {showCategoryTransition && presentationSlides[currentSlide]?.category && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-3 px-6 py-2.5 bg-surface-elevated border border-border rounded-full shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-medium text-foreground/90 uppercase tracking-widest text-[10px]">
                {presentationSlides[currentSlide].category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={presentationSlides.length}
        onNext={handleNextSlide}
        onPrev={handlePrevSlide}
        onSkip={handleSkipToCoolPart}
        onScrollToTop={handleScrollToTop}
        isScrolled={isScrolled}
        isVisible={!isTechnicalSectionVisible}
      />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {presentationSlides[currentSlide]?.title && (
          <span>
            Slide {currentSlide + 1} of {presentationSlides.length}:{' '}
            {presentationSlides[currentSlide].title}
          </span>
        )}
      </div>

      {/* 
        This section is NO LONGER a scroll container. 
        It is just a wrapper for the slides which are snap-start children of the Main Loop.
        We passed technicalDeckRef to usePresentationLogic, so logic works.
      */}
      <div
        ref={containerRef}
        className="w-full bg-background text-foreground relative"
      >
        <GridBackground fixed />

        {presentationSlides.map((slideData, index) => {
          const slideDirection = index > previousSlideIndex ? 'down' : 'up';
          const shouldAnimate = index === currentSlide && index !== previousSlideIndex;

          return (
            <div
              key={index}
              ref={el => {
                slideRefs.current[index] = el;
              }}
              className="h-screen snap-start flex items-center justify-center pt-28 pb-6 px-6 md:pt-32 md:pb-12 md:px-12 lg:pt-36 lg:pb-16 lg:px-16 relative z-10 shrink-0 overflow-hidden max-w-full"
            >
              <div className="w-full max-w-full flex items-center justify-center overflow-hidden">
                {slideData.type === 'separator' && (
                  <SeparatorSlide
                    slideData={slideData}
                    index={index}
                    shouldAnimate={shouldAnimate}
                    slideDirection={slideDirection}
                  />
                )}
                {slideData.type === 'title' && (
                  <TitleSlide
                    slideData={slideData}
                    index={index}
                    shouldAnimate={shouldAnimate}
                    slideDirection={slideDirection}
                  />
                )}
                {slideData.type === 'content' && (
                  <ContentSlide
                    slideData={slideData}
                    index={index}
                    shouldAnimate={shouldAnimate}
                    slideDirection={slideDirection}
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
};
