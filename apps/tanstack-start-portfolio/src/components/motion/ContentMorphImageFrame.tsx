'use client';

import { motion, type Transition } from 'motion/react';
import type { ReactNode } from 'react';

export type ContentMorphImageFrameProps = {
  layoutId: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

/** App-bundle morph frame — must share motion/react with detail-page layout targets. */
export function ContentMorphImageFrame({
  layoutId,
  transition,
  className,
  style,
  children,
}: ContentMorphImageFrameProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={false}
      transition={transition}
      className={className}
      style={style}
    >
      <motion.div layout='position' className='relative h-full w-full'>
        {children}
      </motion.div>
    </motion.div>
  );
}
