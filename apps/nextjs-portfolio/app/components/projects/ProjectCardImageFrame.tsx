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
  /** Badges/metadata layered on the image. */
  overlay?: ReactNode;
  /** When true, only top corners are rounded (card header image). */
  flushTop?: boolean;
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
  flushTop = true,
}: ProjectCardImageFrameProps) {
  const reduceMotion = useReducedMotion();
  const effectiveLayoutId = layoutId && !reduceMotion ? layoutId : undefined;

  const frameClassName = cn(
    'relative h-full w-full overflow-hidden bg-neutral-950/5',
    flushTop ? 'rounded-t-2xl' : 'rounded-2xl',
  );

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
        'transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.02]',
        imageClassName,
      )}
    />
  ) : (
    <div
      className='absolute inset-0 bg-linear-to-br from-accent/[0.08] via-surface-subtle to-surface'
      aria-hidden
    />
  );

  const frameBody = (
    <>
      {imageContent}
      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95'
        aria-hidden
      />
      {overlay}
    </>
  );

  return (
    <div className={cn('relative overflow-hidden', aspectClassName)}>
      {effectiveLayoutId ? (
        <motion.div
          layoutId={effectiveLayoutId}
          initial={false}
          transition={sharedLayoutTransition}
          className={frameClassName}
        >
          {frameBody}
        </motion.div>
      ) : (
        <div className={frameClassName}>{frameBody}</div>
      )}
    </div>
  );
}
