import { getGlobalLenis } from '@/app/lib/lenis-registry';

const HEADER_OFFSET_PX = 120;

function prefersReducedMotion(): boolean {
  if (typeof globalThis.window === 'undefined') return false;
  return globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scroll listing results into view after pagination — respects Lenis when active. */
export function scrollToSearchResults(targetId?: string) {
  if (typeof globalThis.window === 'undefined') return;

  const reducedMotion = prefersReducedMotion();
  const behavior = reducedMotion ? 'auto' : 'smooth';
  const anchor = targetId ? document.getElementById(`${targetId}-top`) : null;
  const target = anchor ?? (targetId ? document.getElementById(targetId) : null);
  const lenis = getGlobalLenis();

  if (target && lenis) {
    lenis.scrollTo(target, {
      offset: -HEADER_OFFSET_PX,
      immediate: reducedMotion,
      duration: reducedMotion ? 0 : 0.85,
    });
    return;
  }

  if (target) {
    target.scrollIntoView({ behavior, block: 'start' });
    return;
  }

  globalThis.window.scrollTo({ top: 0, left: 0, behavior });
}
