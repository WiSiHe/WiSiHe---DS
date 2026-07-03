'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  getGlobalLenis,
  scrollDocumentToTop,
  shouldSkipDocumentScrollRestoration,
} from '@/app/lib/lenis-registry';

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

/**
 * Resets document scroll on client navigations. Next.js scroll restoration does not
 * reach Lenis, so route changes would otherwise keep the previous page's position.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
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

    scrollDocumentToTop({ immediate: true });

    // Lenis may mount shortly after navigation (e.g. paintings listing → detail).
    const rafId = requestAnimationFrame(() => scrollDocumentToTop({ immediate: true }));
    const timeoutId = window.setTimeout(() => {
      scrollDocumentToTop({ immediate: true });
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
