'use client';

import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { shouldUsePresentationScrollMode } from '@/lib/lenis-registry';

/** Locks the page to a single native scroll container for slide decks. */
export function PresentationMode() {
  const { pathname } = useLocation();
  const immersive = shouldUsePresentationScrollMode(pathname);

  useEffect(() => {
    if (!immersive) return;

    document.documentElement.dataset.presentationMode = 'true';
    return () => {
      delete document.documentElement.dataset.presentationMode;
    };
  }, [immersive]);

  return null;
}
