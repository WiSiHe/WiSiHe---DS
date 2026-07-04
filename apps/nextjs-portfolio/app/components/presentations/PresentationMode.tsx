'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { shouldUsePresentationScrollMode } from '@/app/lib/lenis-registry';

/**
 * Locks the page to a single native scroll container for slide decks.
 * Disables footer chrome and prevents Lenis from fighting nested scroll.
 */
export function PresentationMode() {
  const pathname = usePathname();
  const immersive = shouldUsePresentationScrollMode(pathname);

  useEffect(() => {
    if (!immersive) return;

    document.documentElement.dataset['presentationMode'] = 'true';
    return () => {
      delete document.documentElement.dataset['presentationMode'];
    };
  }, [immersive]);

  return null;
}
