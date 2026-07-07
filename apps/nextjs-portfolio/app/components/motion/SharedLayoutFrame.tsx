'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';

type SharedLayoutFrameProps = {
  slug: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  transition?: Transition;
  onLayoutAnimationStart?: () => void;
  onLayoutAnimationComplete?: () => void;
};

/** Morph target/source wrapper for painting & project hero images. */
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

  if (reduceMotion || !slug.trim()) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      layoutId={contentImageLayoutId(slug)}
      initial={false}
      transition={transition}
      className={cn(className)}
      style={{ borderRadius: 16, ...style }}
      onLayoutAnimationStart={onLayoutAnimationStart}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
    >
      {children}
    </motion.div>
  );
}
