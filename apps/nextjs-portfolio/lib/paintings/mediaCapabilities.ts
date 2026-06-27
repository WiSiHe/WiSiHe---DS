'use client';

import { useLayoutEffect, useState } from 'react';

export function prefersFinePointerHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Desktop fine-pointer hover — brush reveal runs only when true. */
export function useCanBrushReveal(): boolean {
  const [canReveal, setCanReveal] = useState(false);

  useLayoutEffect(() => {
    setCanReveal(prefersFinePointerHover());
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanReveal(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return canReveal;
}
