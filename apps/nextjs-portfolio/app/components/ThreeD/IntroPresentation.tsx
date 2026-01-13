'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ScrollIndicator } from '../ScrollIndicator';
import { SeparatorSlide } from './Slides/SeparatorSlide';
import { TitleSlide } from './Slides/TitleSlide';
import { ContentSlide } from './Slides/ContentSlide';
import { presentationSlides } from '../../three-d/presentationSlides';
import { GridBackground } from './GridBackground';

export const IntroPresentation = ({
  technicalDeckRef,
}: {
  technicalDeckRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCategoryTransition, setShowCategoryTransition] = useState(false);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTechnicalSectionVisible, setIsTechnicalSectionVisible] = useState(false);
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
    technicalDeckRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

      {/* Navigation Buttons - Hidden when technical section is visible */}
      {!isTechnicalSectionVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Scroll to Top Button */}
          <motion.button
            onClick={handleScrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-surface-elevated/90 text-foreground rounded-full font-semibold shadow-lg shadow-accent/20 border-2 border-border/50 hover:border-accent/50 hover:bg-surface/90 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Scroll to top"
            type="button"
          >
            <span aria-hidden="true">↑</span>
            <span>Scroll to top</span>
          </motion.button>

          {/* Skip to Cool Part Button */}
          <motion.button
            onClick={handleSkipToCoolPart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold shadow-lg shadow-accent/30 hover:bg-accent hover:opacity-100 active:scale-95 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Skip to technical slide deck"
            type="button"
          >
            <span>Skip to the cool part</span>
            <span aria-hidden="true">→</span>
          </motion.button>
        </div>
      )}

      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {presentationSlides[currentSlide]?.title && (
          <span>Slide {currentSlide + 1} of {presentationSlides.length}: {presentationSlides[currentSlide].title}</span>
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
                {slideData.type === 'separator' ? (
                  <SeparatorSlide
                    slideData={slideData}
                    index={index}
                    shouldAnimate={shouldAnimate}
                    slideDirection={slideDirection}
                  />
                ) : slideData.type === 'title' ? (
                  <TitleSlide
                    slideData={slideData}
                    index={index}
                    shouldAnimate={shouldAnimate}
                    slideDirection={slideDirection}
                  />
                ) : (
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
