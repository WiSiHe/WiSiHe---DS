'use client';

import { useRouterState } from '@tanstack/react-router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import {
  getGlobalLenis,
  isPaintingsRoute,
  restoreDocumentScroll,
  restorePaintingsDocumentScroll,
  scrollDocumentToTop,
  scrollPaintingsDocumentToTop,
  shouldSkipDocumentScrollRestoration,
} from '@/lib/lenis-registry';
import { consumeListScrollPosition } from '@/lib/navigation/listScrollRestoration';

const HEADER_OFFSET_PX = 120;

function scrollToHashTarget(hash: string): boolean {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const lenis = getGlobalLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -HEADER_OFFSET_PX, immediate: true });
    return true;
  }

  target.scrollIntoView({ behavior: 'auto', block: 'start' });
  return true;
}

/** Resets or restores document scroll on client navigations. */
export function ScrollToTopOnNavigate() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!pathname || shouldSkipDocumentScrollRestoration(pathname)) return;

    const hash = window.location.hash;
    if (hash && scrollToHashTarget(hash)) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const savedScrollY = consumeListScrollPosition(pathname);
    if (savedScrollY != null) {
      const restoreScroll = isPaintingsRoute(pathname)
        ? () => restorePaintingsDocumentScroll(savedScrollY)
        : () => restoreDocumentScroll(savedScrollY, { immediate: true });

      restoreScroll();

      const rafId = requestAnimationFrame(() => restoreScroll());
      const timeoutId = window.setTimeout(() => {
        restoreScroll();
        ScrollTrigger.refresh();
      }, 150);

      return () => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(timeoutId);
      };
    }

    const scrollToTop = isPaintingsRoute(pathname)
      ? scrollPaintingsDocumentToTop
      : () => scrollDocumentToTop({ immediate: true });

    scrollToTop();

    const rafId = requestAnimationFrame(() => scrollToTop());
    const timeoutId = window.setTimeout(() => {
      scrollToTop();
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
