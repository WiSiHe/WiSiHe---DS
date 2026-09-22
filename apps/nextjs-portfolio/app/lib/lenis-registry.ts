/**
 * Locomotive Scroll v5 (Lenis) — shared instance for scroll-linked UI and smooth scrollTo.
 */

import type Lenis from 'lenis';
import type LocomotiveScroll from 'locomotive-scroll';

let lenisInstance: Lenis | null = null;
let locomotiveInstance: LocomotiveScroll | null = null;

export function setGlobalLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getGlobalLenis(): Lenis | null {
  return lenisInstance;
}

export function setGlobalLocomotive(instance: LocomotiveScroll | null) {
  locomotiveInstance = instance;
}

export function getGlobalLocomotive(): LocomotiveScroll | null {
  return locomotiveInstance;
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

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type ScrollDocumentOptions = {
  /** Jump instantly — default for route changes and when reduced motion is on. */
  immediate?: boolean;
};

/** Scroll the document to top — uses Lenis when smooth scroll is active. */
export function scrollDocumentToTop(options: ScrollDocumentOptions = {}): void {
  if (typeof window === 'undefined') return;

  const immediate = options.immediate ?? prefersReducedMotion();
  const lenis = lenisInstance;

  if (lenis) {
    lenis.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: immediate ? 'auto' : 'smooth',
  });
}

/** Native scroll reset for paintings routes (Lenis is disabled there). */
export function scrollPaintingsDocumentToTop(): void {
  restorePaintingsDocumentScroll(0);
}

/** Native scroll restore for paintings routes (Lenis is disabled there). */
export function restorePaintingsDocumentScroll(y: number): void {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

export type RestoreDocumentScrollOptions = {
  /** Jump instantly — default for route changes and when reduced motion is on. */
  immediate?: boolean;
};

/** Restore document scroll — uses Lenis when smooth scroll is active. */
export function restoreDocumentScroll(y: number, options: RestoreDocumentScrollOptions = {}): void {
  if (typeof window === 'undefined') return;

  const immediate = options.immediate ?? prefersReducedMotion();
  const lenis = lenisInstance;

  if (lenis) {
    lenis.scrollTo(y, { immediate });
    return;
  }

  window.scrollTo({
    top: y,
    left: 0,
    behavior: immediate ? 'auto' : 'smooth',
  });
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

/** Paintings listing + detail — native document scroll only (no Lenis handoff). */
export function isPaintingsRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === '/paintings' || pathname.startsWith('/paintings/');
}

/** Routes with a nested scroll container or fullscreen canvas instead of the document (decks, full-canvas 3D). */
export function shouldUsePresentationScrollMode(pathname: string | null): boolean {
  if (!pathname) return false;
  if (
    pathname === '/three-d/webgpu' ||
    pathname === '/three-d/webgl' ||
    pathname === '/three-d/shaders'
  ) {
    return true;
  }
  if (pathname.startsWith('/presentations/') && pathname !== '/presentations') return true;
  return false;
}

/** Let Next.js handle scroll restoration — skip Lenis scroll-to-top on nested scroll routes. */
export function shouldSkipDocumentScrollRestoration(pathname: string | null): boolean {
  if (!pathname) return false;
  if (shouldUsePresentationScrollMode(pathname)) return true;
  return false;
}
