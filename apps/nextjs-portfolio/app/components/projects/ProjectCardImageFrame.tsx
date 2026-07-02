'use client';

import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { sharedLayoutTransition } from '@/lib/motion/sharedLayout';

export type ProjectCardImageFrameProps = {
  imageSrc: string | null;
  alt: string;
  lqip?: string | null;
  priority?: boolean;
  fetchPriority?: ImageProps['fetchPriority'];
  sizes?: string;
  aspectClassName?: string;
  imageClassName?: string;
  /** Enables shared layout morph into project detail hero. */
  layoutId?: string;
  /** Badges/metadata layered on the image (positioned inside the inset frame). */
  overlay?: ReactNode;
};

export function ProjectCardImageFrame({
  imageSrc,
  alt,
  lqip,
  priority,
  fetchPriority,
  sizes = '(max-width: 768px) 100vw, 50vw',
  aspectClassName = 'aspect-4/3',
  imageClassName = 'object-cover',
  layoutId,
  overlay,
}: ProjectCardImageFrameProps) {
  const reduceMotion = useReducedMotion();
  const effectiveLayoutId = layoutId && !reduceMotion ? layoutId : undefined;

  const frameClassName =
    'relative h-full w-full overflow-hidden rounded-2xl bg-surface-subtle/50 ring-1 ring-border/40';

  const imageContent = imageSrc ? (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={fetchPriority}
      sizes={sizes}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip ?? undefined}
      className={cn(
        'transition-transform duration-700 ease-out group-hover:scale-[1.03]',
        imageClassName,
      )}
    />
  ) : (
    <div
      className='absolute inset-0 bg-linear-to-br from-accent/[0.06] via-surface-subtle to-foreground/[0.03] dark:from-accent/[0.09] dark:to-foreground/[0.02]'
      aria-hidden
    />
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-linear-to-br from-accent/8 via-surface-subtle to-surface-subtle',
        aspectClassName,
      )}
    >
      <div className='absolute inset-0 p-4 md:p-5'>
        {effectiveLayoutId ? (
          <motion.div
            layoutId={effectiveLayoutId}
            initial={false}
            transition={sharedLayoutTransition}
            className={frameClassName}
          >
            {imageContent}
            {overlay}
          </motion.div>
        ) : (
          <div className={frameClassName}>
            {imageContent}
            {overlay}
          </div>
        )}
      </div>
    </div>
  );
}
