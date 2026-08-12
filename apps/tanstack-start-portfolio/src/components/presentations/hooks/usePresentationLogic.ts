'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PresentationSlide } from '@/lib/presentations/types';

type UsePresentationLogicProps = {
  slides: PresentationSlide[];
  scrollRoot: HTMLElement | null;
};

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

export function usePresentationLogic({ slides, scrollRoot }: UsePresentationLogicProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCategoryTransition, setShowCategoryTransition] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousCategoryRef = useRef<string | undefined>(undefined);

  const currentSlideRef = useRef(0);
  const isScrolledRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingUpdatesRef = useRef<{
    currentSlide?: number;
    showCategoryTransition?: boolean;
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

  useEffect(() => {
    if (!scrollRoot) return;

    slideRefs.current = slideRefs.current.slice(0, slides.length);

    const observers: IntersectionObserver[] = [];
    let categoryTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const newCategory = slides[index]?.category;
              const previousCategory = previousCategoryRef.current;

              if (index !== currentSlideRef.current) {
                pendingUpdatesRef.current.currentSlide = index;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollRoot) return;

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
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, scrollRoot, scrollToSlide]);

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

  const handleScrollToTop = useCallback(() => {
    scrollRoot?.scrollTo({ top: 0, behavior: 'smooth' });
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
    isScrolled,
    containerRef,
    slideRefs,
    handleScrollToTop,
    handlePrevSlide,
    handleNextSlide,
  };
}
