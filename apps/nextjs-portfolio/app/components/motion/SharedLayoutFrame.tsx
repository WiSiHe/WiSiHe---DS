'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { contentSlugLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';

type SharedLayoutFrameProps = {
  /** Content slug — must match grid card layoutId key. */
  slug: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  transition?: Transition;
  onLayoutAnimationStart?: () => void;
  onLayoutAnimationComplete?: () => void;
};

/** Morph target wrapper for list → detail hero transitions. */
export function SharedLayoutFrame({
  slug,
  className,
  style,
  children,
  transition = sharedLayoutTransition,
  onLayoutAnimationStart,
  onLayoutAnimationComplete,
}: SharedLayoutFrameProps) {
  const reduceMotion = useReducedMotion();
  const layoutId = contentSlugLayoutId(slug);

  if (!layoutId || reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      initial={false}
      transition={transition}
      className={cn(className)}
      style={style}
      onLayoutAnimationStart={onLayoutAnimationStart}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
    >
      {children}
    </motion.div>
  );
}
