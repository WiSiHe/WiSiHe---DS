'use client';

import { LayoutGroup } from 'motion/react';
import type { ReactNode } from 'react';

/** Single LayoutGroup for shared layout morphs — do not wrap pages in AnimatePresence. */
export function MotionLayoutGroup({ children }: { children: ReactNode }) {
  return <LayoutGroup id='wisihe-shared-layout'>{children}</LayoutGroup>;
}
