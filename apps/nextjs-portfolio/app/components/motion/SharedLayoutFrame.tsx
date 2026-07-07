'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import { useSafariSharedLayout } from '@/lib/paintings/mediaCapabilities';

type SharedLayoutFrameProps = {
  title: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  transition?: Transition;
};

/** Morph target/source wrapper for painting & project hero images. */
export function SharedLayoutFrame({
  title,
  className,
  style,
  children,
  transition = sharedLayoutTransition,
}: SharedLayoutFrameProps) {
  const reduceMotion = useReducedMotion();
  const safariSharedLayout = useSafariSharedLayout();

  if (reduceMotion || safariSharedLayout || !title.trim()) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      layoutId={contentImageLayoutId(title)}
      initial={false}
      transition={transition}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}
