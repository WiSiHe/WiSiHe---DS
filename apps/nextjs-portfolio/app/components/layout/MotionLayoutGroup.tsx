'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SHARED_LAYOUT_ROUTE } from '@/lib/motion/sharedLayout';

export function MotionLayoutGroup({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const enablePopLayout = SHARED_LAYOUT_ROUTE.test(pathname ?? '');

  return (
    <LayoutGroup id='wisihe-shared-layout'>
      {enablePopLayout ? (
        <AnimatePresence mode='popLayout' initial={false}>
          <motion.div key={pathname}>{children}</motion.div>
        </AnimatePresence>
      ) : (
        children
      )}
    </LayoutGroup>
  );
}
