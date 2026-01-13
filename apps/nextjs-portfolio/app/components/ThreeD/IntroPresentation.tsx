'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScrollIndicator } from '../ScrollIndicator';
import { SeparatorSlide } from './Slides/SeparatorSlide';
import { TitleSlide } from './Slides/TitleSlide';
import { ContentSlide } from './Slides/ContentSlide';
import { presentationSlides as fallbackSlides } from '../../three-d/presentationSlides';
import { GridBackground } from './GridBackground';
import type { PresentationSlide } from '../../three-d/types';

export const IntroPresentation = ({
  technicalDeckRef,
  technicalSeparatorRef,
  slides,
}: {
  technicalDeckRef: React.RefObject<HTMLDivElement | null>;
  technicalSeparatorRef?: React.RefObject<HTMLElement | null>;
  slides?: PresentationSlide[] | null;
}) => {
  // Use Sanity slides if available, otherwise fall back to static slides
  const presentationSlides = slides && slides.length > 0 ? slides : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCategoryTransition, setShowCategoryTransition] = useState(false);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTechnicalSectionVisible, setIsTechnicalSectionVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousCategoryRef = useRef<string | undefined>(undefined);

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

  // Track technical deck visibility to hide skip button
  useEffect(() => {
    if (!technicalDeckRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsTechnicalSectionVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-20% 0px -20% 0px',
      },
    );

    observer.observe(technicalDeckRef.current);

    return () => {
      observer.disconnect();
    };
  }, [technicalDeckRef]);

  // Scroll tracking with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const newCategory = presentationSlides[index]?.category;
              const previousCategory = previousCategoryRef.current;

              // Detect scroll direction based on slide change
              if (index !== previousSlideIndex) {
                setPreviousSlideIndex(index);
              }

              // Show category transition if category changed
              if (newCategory && newCategory !== previousCategory) {
                setShowCategoryTransition(true);
                setTimeout(() => setShowCategoryTransition(false), 2000);
              }

              previousCategoryRef.current = newCategory;
              setCurrentSlide(index);
            }
          });
        },
        {
          threshold: 0.6,
          rootMargin: '-10% 0px -10% 0px',
        },
      );

      observer.observe(slide);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [presentationSlides.length, previousSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        if (currentSlide < presentationSlides.length - 1) {
          slideRefs.current[currentSlide + 1]?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        if (currentSlide > 0) {
          slideRefs.current[currentSlide - 1]?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, presentationSlides.length]);

  const handleSkipToCoolPart = () => {
    // Scroll to the "Now for the Technical Part" separator section
    if (technicalSeparatorRef?.current) {
      technicalSeparatorRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to technical deck if separator ref not available
      technicalDeckRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track scroll position to show/hide scroll to top button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Check if scrolled down (more than 50px threshold)
      const scrolled = container.scrollTop > 50;
      setIsScrolled(scrolled);
    };

    // Check initial scroll position
    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    // Scroll to absolute top
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Also scroll window to top as fallback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      slideRefs.current[currentSlide - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < presentationSlides.length - 1) {
      slideRefs.current[currentSlide + 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === presentationSlides.length - 1;

  return (
    <>
      {/* Scroll Indicator */}
      <ScrollIndicator currentSlide={currentSlide} totalSlides={presentationSlides.length} />

      {/* Category Transition Indicator */}
      {showCategoryTransition && presentationSlides[currentSlide]?.category && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface-elevated px-6 py-3 rounded-full border-2 border-accent/50 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">
              {presentationSlides[currentSlide].category}
            </span>
          </div>
        </motion.div>
      )}

      {/* Navigation Panel - All controls on right side */}
      {!isTechnicalSectionVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Slide Navigation Group */}
          <div className="flex flex-col items-center gap-1 bg-surface-elevated/95 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
            {/* Previous Slide Button */}
            <motion.button
              onClick={handlePrevSlide}
              disabled={isFirstSlide}
              whileHover={isFirstSlide ? {} : { scale: 1.1 }}
              whileTap={isFirstSlide ? {} : { scale: 0.95 }}
              className={`w-10 h-10 rounded-xl font-semibold transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isFirstSlide
                  ? 'text-foreground/30 cursor-not-allowed'
                  : 'text-foreground hover:bg-surface/80 hover:text-accent'
              }`}
              aria-label="Previous slide"
              type="button"
            >
              <span aria-hidden="true" className="text-lg">
                ↑
              </span>
            </motion.button>

            {/* Slide Counter */}
            <div className="px-3 py-1">
              <span className="text-xs font-mono text-foreground/60">
                {currentSlide + 1}/{presentationSlides.length}
              </span>
            </div>

            {/* Next Slide Button */}
            <motion.button
              onClick={handleNextSlide}
              disabled={isLastSlide}
              whileHover={isLastSlide ? {} : { scale: 1.1 }}
              whileTap={isLastSlide ? {} : { scale: 0.95 }}
              className={`w-10 h-10 rounded-xl font-semibold transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isLastSlide
                  ? 'text-foreground/30 cursor-not-allowed'
                  : 'text-foreground hover:bg-surface/80 hover:text-accent'
              }`}
              aria-label="Next slide"
              type="button"
            >
              <span aria-hidden="true" className="text-lg">
                ↓
              </span>
            </motion.button>
          </div>

          {/* Action Buttons Group */}
          <div className="flex flex-col gap-2">
            {/* Scroll to Top Button - Only show when scrolled */}
            {isScrolled && (
              <motion.button
                onClick={handleScrollToTop}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-surface-elevated/95 backdrop-blur-sm text-foreground rounded-xl font-medium text-sm shadow-lg border border-border/50 hover:border-accent/50 hover:text-accent transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Scroll to top"
                type="button"
              >
                <span aria-hidden="true">↑</span>
                <span>Top</span>
              </motion.button>
            )}

            {/* Skip to Cool Part Button */}
            <motion.button
              onClick={handleSkipToCoolPart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium text-sm shadow-lg shadow-accent/20 hover:opacity-90 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Skip to technical presentation"
              type="button"
            >
              <span>Skip ahead</span>
              <span aria-hidden="true">→</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {presentationSlides[currentSlide]?.title && (
          <span>
            Slide {currentSlide + 1} of {presentationSlides.length}:{' '}
            {presentationSlides[currentSlide].title}
          </span>
        )}
      </div>

      {/* Scroll Container */}
      <section
        ref={containerRef}
        className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-background text-foreground relative overflow-x-hidden"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100vw',
          scrollPaddingTop: '0',
        }}
      >
        <GridBackground fixed />

        {presentationSlides.map((slideData, index) => {
          const isActive = index === currentSlide;
          const slideDirection = index > previousSlideIndex ? 'down' : 'up';
          const shouldAnimate = isActive && index !== previousSlideIndex;

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
      </section>
    </>
  );
};
