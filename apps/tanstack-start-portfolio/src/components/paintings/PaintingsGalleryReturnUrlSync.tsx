'use client';

import { useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { writePaintingsGalleryReturnUrl } from '@/lib/paintings/paintingsGalleryReturnUrl';

/** Sync gallery return URL for non-Algolia fallback listing (Algolia provider handles its own). */
export function PaintingsGalleryReturnUrlSync() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  const searchStr = useRouterState({ select: state => state.location.searchStr });

  useEffect(() => {
    if (pathname !== '/paintings') return;
    const qs = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
    writePaintingsGalleryReturnUrl(qs ? `/paintings?${qs}` : '/paintings');
  }, [pathname, searchStr]);

  return null;
}
