'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * `useReducedMotion()` reads `matchMedia` synchronously on the client's first render, but the server
 * can't know the preference. Using it directly in render markup makes the first client render differ
 * from the server HTML for visitors who prefer reduced motion (React hydration error #418).
 * This returns `false` until after mount, then the real preference.
 */
export function useHydrationSafeReducedMotion(): boolean {
  const preference = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && Boolean(preference);
}
