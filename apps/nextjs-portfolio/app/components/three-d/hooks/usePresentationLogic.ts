import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import type { PresentationSlide } from '../../../three-d/types';

interface UsePresentationLogicProps {
  slides: PresentationSlide[];
  mainRef?: RefObject<HTMLElement | null>;
  technicalDeckRef?: RefObject<HTMLDivElement | null>;
  technicalSeparatorRef?: RefObject<HTMLElement | null>;
}

function getScrollRoot(mainRef?: RefObject<HTMLElement | null>): HTMLElement | null {
  return mainRef?.current ?? null;
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

export const usePresentationLogic = ({
  slides,
  mainRef,
  technicalDeckRef,
  technicalSeparatorRef,
}: UsePresentationLogicProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCategoryTransition, setShowCategoryTransition] = useState(false);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTechnicalSectionVisible, setIsTechnicalSectionVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousCategoryRef = useRef<string | undefined>(undefined);

  const currentSlideRef = useRef(0);
  const previousSlideIndexRef = useRef(0);
  const isScrolledRef = useRef(false);
  const isTechnicalSectionVisibleRef = useRef(false);

  const rafIdRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<{
    currentSlide?: number;
    previousSlideIndex?: number;
    showCategoryTransition?: boolean;
    isTechnicalSectionVisible?: boolean;
    isScrolled?: boolean;
  }>({});

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

      if (
        updates.isTechnicalSectionVisible !== undefined &&
        updates.isTechnicalSectionVisible !== isTechnicalSectionVisibleRef.current
      ) {
        isTechnicalSectionVisibleRef.current = updates.isTechnicalSectionVisible;
        setIsTechnicalSectionVisible(updates.isTechnicalSectionVisible);
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
      const root = getScrollRoot(mainRef);
      const slide = slideRefs.current[index];
      if (!root || !slide) return;
      scrollElementIntoRoot(root, slide, behavior);
    },
    [mainRef],
  );

  const scrollToElementInRoot = useCallback(
    (element: HTMLElement | null | undefined, behavior: ScrollBehavior = 'smooth') => {
      const root = getScrollRoot(mainRef);
      if (!root || !element) return;
      scrollElementIntoRoot(root, element, behavior);
    },
    [mainRef],
  );

  // Technical section visibility — observe within the deck scroll root
  useEffect(() => {
    const root = getScrollRoot(mainRef);
    if (!technicalDeckRef?.current || !root) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting;
          if (isVisible !== isTechnicalSectionVisibleRef.current) {
            pendingUpdatesRef.current.isTechnicalSectionVisible = isVisible;
            flushPendingUpdates();
          }
        });
      },
      {
        root,
        threshold: 0.1,
        rootMargin: '-20% 0px -20% 0px',
      },
    );

    observer.observe(technicalDeckRef.current);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [technicalDeckRef, mainRef, flushPendingUpdates]);

  // Slide tracking — root must be the same element that scrolls
  useEffect(() => {
    const root = getScrollRoot(mainRef);
    if (!root) return;

    const observers: IntersectionObserver[] = [];
    let categoryTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
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
          root,
          threshold: [0.55, 0.65, 0.75],
          rootMargin: '-12% 0px -12% 0px',
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
  }, [slides.length, slides, mainRef, flushPendingUpdates]);

  // Keyboard navigation — scroll the deck container, not the window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const root = getScrollRoot(mainRef);
      if (!root) return;

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
  }, [slides.length, mainRef, scrollToSlide]);

  // Scroll position on the deck root (not the inner wrapper)
  useEffect(() => {
    const root = getScrollRoot(mainRef);
    if (!root) return;

    const handleScroll = () => {
      const scrolled = root.scrollTop > 50;
      if (scrolled !== isScrolledRef.current) {
        pendingUpdatesRef.current.isScrolled = scrolled;
        flushPendingUpdates();
      }
    };

    handleScroll();
    root.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      root.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [mainRef, flushPendingUpdates]);

  const handleSkipToCoolPart = useCallback(() => {
    if (technicalSeparatorRef?.current) {
      scrollToElementInRoot(technicalSeparatorRef.current);
    } else {
      scrollToElementInRoot(technicalDeckRef?.current);
    }
  }, [technicalSeparatorRef, technicalDeckRef, scrollToElementInRoot]);

  const handleScrollToTop = useCallback(() => {
    const root = getScrollRoot(mainRef);
    if (root) {
      root.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [mainRef]);

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
