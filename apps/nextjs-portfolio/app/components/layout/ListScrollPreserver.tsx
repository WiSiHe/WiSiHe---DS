'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  isScrollRestoreListRoute,
  saveListScrollPosition,
} from '@/lib/navigation/listScrollRestoration';

/**
 * Persists list scroll in sessionStorage while on /paintings and /projects,
 * so browser back can restore the previous position.
 */
export function ListScrollPreserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !isScrollRestoreListRoute(pathname)) return;

    let rafId = 0;

    const save = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => saveListScrollPosition(pathname));
    };

    window.addEventListener('scroll', save, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', save);
      saveListScrollPosition(pathname);
    };
  }, [pathname]);

  return null;
}
