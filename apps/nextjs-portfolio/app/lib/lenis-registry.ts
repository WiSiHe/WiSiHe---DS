/**
 * Single Lenis instance from SmoothScroll — read `scroll` here so scroll-linked UI matches
 * smooth scroll (window.scrollY can lag or disagree with Lenis).
 */

import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setGlobalLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getGlobalLenis(): Lenis | null {
  return lenisInstance;
}

/** Document scroll position — prefer Lenis when the app uses smooth scroll */
export function getDocumentScrollTop(): number {
  if (typeof window === 'undefined') return 0;
  const lenis = lenisInstance;
  if (lenis && typeof lenis.scroll === 'number') {
    return lenis.scroll;
  }
  return window.scrollY;
}
