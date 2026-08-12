'use client';

import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import {
  isScrollRestoreListRoute,
  saveListScrollPosition,
} from '@/lib/navigation/listScrollRestoration';

/** Persists list scroll in sessionStorage on listing routes for back-navigation restore. */
export function ListScrollPreserver() {
  const pathname = useRouterState({ select: state => state.location.pathname });

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
