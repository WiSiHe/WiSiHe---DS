'use client';

import { LayoutGroup } from 'motion/react';
import type { ReactNode } from 'react';

export function MotionLayoutGroup({ children }: { children: ReactNode }) {
  return <LayoutGroup id='wisihe-shared-layout'>{children}</LayoutGroup>;
}
