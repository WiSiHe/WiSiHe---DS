'use client';

import { useLayoutEffect, useState } from 'react';
import { contentImageLayoutId } from '@/lib/motion/sharedLayout';
import { useSafariSharedLayout } from '@/lib/paintings/mediaCapabilities';

/**
 * List-side shared layout id — attached after mount on non-Safari browsers only.
 * Avoids SSR/hydration mismatches and Safari layoutId compositor bugs.
 */
export function usePaintingListImageLayoutId(title: string): string | undefined {
  const safariSharedLayout = useSafariSharedLayout();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  if (!ready || safariSharedLayout || !title.trim()) return undefined;
  return contentImageLayoutId(title);
}
