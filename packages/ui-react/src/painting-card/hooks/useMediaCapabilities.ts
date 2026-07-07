'use client';

import { useLayoutEffect, useState, useSyncExternalStore } from 'react';

export function prefersFinePointerHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * WebKit Safari — SVG filters, mix-blend, and pathLength animation are very costly.
 * Chrome/Firefox/Edge on macOS are excluded.
 */
export function isSafariBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
}

function subscribeNoop() {
  return () => {};
}

/** Safari / WebKit — lighter brush reveal (no filters, blend modes, or path draw). */
export function useBrushRevealLite(): boolean {
  return useSyncExternalStore(subscribeNoop, isSafariBrowser, () => false);
}

/** Safari — skip layoutId shared morph; use manual painting transition instead. */
export function useSafariSharedLayout(): boolean {
  return useBrushRevealLite();
}

type BrushRevealListener = (canReveal: boolean) => void;

let brushRevealSubscribed = false;
let brushRevealValue = false;
const brushRevealListeners = new Set<BrushRevealListener>();

function subscribeBrushRevealMedia() {
  if (brushRevealSubscribed || typeof window === 'undefined') return;
  brushRevealSubscribed = true;

  brushRevealValue = prefersFinePointerHover();
  const media = window.matchMedia('(hover: hover) and (pointer: fine)');
  const update = () => {
    brushRevealValue = media.matches;
    for (const listener of brushRevealListeners) {
      listener(brushRevealValue);
    }
  };
  media.addEventListener('change', update);
}

const DESKTOP_PAINTING_GRID_QUERY = '(min-width: 1024px)';

export function prefersDesktopPaintingGrid(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DESKTOP_PAINTING_GRID_QUERY).matches;
}

type DesktopGridListener = (isDesktop: boolean) => void;

let desktopGridSubscribed = false;
let desktopGridValue = false;
const desktopGridListeners = new Set<DesktopGridListener>();

function subscribeDesktopGridMedia() {
  if (desktopGridSubscribed || typeof window === 'undefined') return;
  desktopGridSubscribed = true;

  desktopGridValue = prefersDesktopPaintingGrid();
  const media = window.matchMedia(DESKTOP_PAINTING_GRID_QUERY);
  const update = () => {
    desktopGridValue = media.matches;
    for (const listener of desktopGridListeners) {
      listener(desktopGridValue);
    }
  };
  media.addEventListener('change', update);
}

/** Desktop gallery grid (lg+) — compact caption-below cards on smaller viewports. */
export function useIsDesktopPaintingGrid(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    subscribeDesktopGridMedia();
    setIsDesktop(desktopGridValue);
    desktopGridListeners.add(setIsDesktop);
    return () => {
      desktopGridListeners.delete(setIsDesktop);
    };
  }, []);

  return isDesktop;
}

/** Desktop fine-pointer hover — brush reveal runs only when true. */
export function useCanBrushReveal(): boolean {
  const [canReveal, setCanReveal] = useState(false);

  useLayoutEffect(() => {
    subscribeBrushRevealMedia();
    setCanReveal(brushRevealValue);
    brushRevealListeners.add(setCanReveal);
    return () => {
      brushRevealListeners.delete(setCanReveal);
    };
  }, []);

  return canReveal;
}
