'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function isImmersivePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/three-d' || pathname.startsWith('/three-d/')) return true;
  if (pathname.startsWith('/presentations/') && pathname !== '/presentations') return true;
  return false;
}

/**
 * Locks the page to a single native scroll container for slide decks.
 * Disables footer chrome and prevents Lenis from fighting nested scroll.
 */
export function PresentationMode() {
  const pathname = usePathname();
  const immersive = isImmersivePath(pathname);

  useEffect(() => {
    if (!immersive) return;

    document.documentElement.dataset.presentationMode = 'true';
    return () => {
      delete document.documentElement.dataset.presentationMode;
    };
  }, [immersive]);

  return null;
}
