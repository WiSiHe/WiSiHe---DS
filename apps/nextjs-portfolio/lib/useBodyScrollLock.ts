'use client';

import { useEffect } from 'react';
import { lockDocumentScroll, unlockDocumentScroll } from '@/lib/documentScrollLock';

/** Lock page scroll while overlays are open. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockDocumentScroll();
    return () => unlockDocumentScroll();
  }, [active]);
}
