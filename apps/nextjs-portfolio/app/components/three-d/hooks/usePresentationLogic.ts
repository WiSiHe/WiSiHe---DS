import { useCallback, useEffect, useRef, useState } from 'react';
import type { PresentationSlide } from '../../../three-d/types';

interface UsePresentationLogicProps {
  slides: PresentationSlide[];
  scrollRoot: HTMLElement | null;
}

function scrollElementIntoRoot(
  root: HTMLElement,
  element: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
) {
  const rootRect = root.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const targetTop = root.scrollTop + elementRect.top - rootRect.top;
  root.scrollTo({ top: targetTop, behavior });
}

export const usePresentationLogic = ({ slides, scrollRoot }: UsePresentationLogicProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCategoryTransition, setShowCategoryTransition] = useState(false);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousCategoryRef = useRef<string | undefined>(undefined);

  const currentSlideRef = useRef(0);
  const previousSlideIndexRef = useRef(0);
  const isScrolledRef = useRef(false);

  const rafIdRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<{
    currentSlide?: number;
    previousSlideIndex?: number;
    showCategoryTransition?: boolean;
    isScrolled?: boolean;
  }>({});

  const technicalDeckIndex = slides.findIndex(s => s.customComponent === 'TechnicalDeck');
  const technicalSeparatorIndex = slides.findIndex(s => s.customComponent === 'TechnicalSeparator');
  const isTechnicalSectionVisible = currentSlide === technicalDeckIndex;

  const flushPendingUpdates = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const updates = pendingUpdatesRef.current;
      if (updates.currentSlide !== undefined && updates.currentSlide !== currentSlideRef.current) {
        currentSlideRef.current = updates.currentSlide;
        setCurrentSlide(updates.currentSlide);
      }

      if (
        updates.previousSlideIndex !== undefined &&
        updates.previousSlideIndex !== previousSlideIndexRef.current
      ) {
        previousSlideIndexRef.current = updates.previousSlideIndex;
        setPreviousSlideIndex(updates.previousSlideIndex);
      }

      if (updates.showCategoryTransition !== undefined) {
        setShowCategoryTransition(updates.showCategoryTransition);
      }

      if (updates.isScrolled !== undefined && updates.isScrolled !== isScrolledRef.current) {
        isScrolledRef.current = updates.isScrolled;
        setIsScrolled(updates.isScrolled);
      }

      pendingUpdatesRef.current = {};
      rafIdRef.current = null;
    });
  }, []);

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const slide = slideRefs.current[index];
      if (!scrollRoot || !slide) return;
      scrollElementIntoRoot(scrollRoot, slide, behavior);
    },
    [scrollRoot],
  );

  // Slide tracking — root must be the same element that scrolls
  useEffect(() => {
    if (!scrollRoot) return;

    // Rescale slideRefs array length to avoid stale refs if slide list changes length
    slideRefs.current = slideRefs.current.slice(0, slides.length);

    const observers: IntersectionObserver[] = [];
    let categoryTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            // Lower threshold (0.5) to reliably fire on smaller viewports where h-[100dvh] is slightly truncated
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const newCategory = slides[index]?.category;
              const previousCategory = previousCategoryRef.current;

              if (index !== currentSlideRef.current) {
                pendingUpdatesRef.current.currentSlide = index;

                if (index !== previousSlideIndexRef.current) {
                  pendingUpdatesRef.current.previousSlideIndex = index;
                }

                if (newCategory && newCategory !== previousCategory) {
                  pendingUpdatesRef.current.showCategoryTransition = true;

                  if (categoryTransitionTimeout) {
                    clearTimeout(categoryTransitionTimeout);
                  }

                  categoryTransitionTimeout = setTimeout(() => {
                    pendingUpdatesRef.current.showCategoryTransition = false;
                    flushPendingUpdates();
                  }, 2000);
                }

                previousCategoryRef.current = newCategory;
                flushPendingUpdates();
              }
            }
          });
        },
        {
          root: scrollRoot,
          threshold: [0.5, 0.6, 0.7],
          rootMargin: '-10% 0px -10% 0px',
        },
      );

      observer.observe(slide);
      observers.push(observer);
    });

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
      if (categoryTransitionTimeout) {
        clearTimeout(categoryTransitionTimeout);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [slides, scrollRoot, flushPendingUpdates]);

  // Keyboard navigation — scroll the deck container, not the window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollRoot) return;

      // Ignore key events when the user is typing in form inputs
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl instanceof HTMLElement && activeEl.isContentEditable))
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        if (currentSlideRef.current < slides.length - 1) {
          scrollToSlide(currentSlideRef.current + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        if (currentSlideRef.current > 0) {
          scrollToSlide(currentSlideRef.current - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, scrollRoot, scrollToSlide]);

  // Scroll position on the deck root (not the inner wrapper)
  useEffect(() => {
    if (!scrollRoot) return;

    const handleScroll = () => {
      const scrolled = scrollRoot.scrollTop > 50;
      if (scrolled !== isScrolledRef.current) {
        pendingUpdatesRef.current.isScrolled = scrolled;
        flushPendingUpdates();
      }
    };

    handleScroll();
    scrollRoot.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollRoot.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [scrollRoot, flushPendingUpdates]);

  const handleSkipToCoolPart = useCallback(() => {
    if (technicalSeparatorIndex !== -1) {
      scrollToSlide(technicalSeparatorIndex);
    } else if (technicalDeckIndex !== -1) {
      scrollToSlide(technicalDeckIndex);
    }
  }, [technicalSeparatorIndex, technicalDeckIndex, scrollToSlide]);

  const handleScrollToTop = useCallback(() => {
    if (scrollRoot) {
      scrollRoot.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollRoot]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideRef.current > 0) {
      scrollToSlide(currentSlideRef.current - 1);
    }
  }, [scrollToSlide]);

  const handleNextSlide = useCallback(() => {
    if (currentSlideRef.current < slides.length - 1) {
      scrollToSlide(currentSlideRef.current + 1);
    }
  }, [slides.length, scrollToSlide]);

  return {
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
  };
};
