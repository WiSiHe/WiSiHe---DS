'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type * as React from 'react';
import type { ContentMorphFrameComponent } from '../painting-card/morphFrame';

export type PhotographyCardImageComponentProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
};

export type PhotographyCardViewProps = {
  title?: string | null;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  blurDataURL?: string | null;
  /** Width / height ratio of the image; drives the frame aspect. */
  aspectRatio?: number;
  placeLabel?: string | null;
  caption?: string | null;
  yearLabel?: string | null;
  priority?: boolean;
  size?: 'default' | 'large';
  className?: string;
  /** Enables shared layout morph into photography detail hero. */
  imageLayoutId?: string;
  imageLayoutTransition?: Transition;
  /** App-provided frame so layoutId uses the same motion instance as the detail page. */
  ImageMorphFrame?: ContentMorphFrameComponent;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  ImageComponent?: React.ComponentType<PhotographyCardImageComponentProps>;
};

function DefaultLink({
  href,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  href: string;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

function DefaultImage({ fill, className, alt = '', src }: PhotographyCardImageComponentProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined;
  return <img src={src} alt={alt} className={className} style={fillStyle} />;
}

/** Framework-agnostic photography card — pass plain props and optional Link/Image components. */
export function PhotographyCardView({
  title,
  href,
  imageSrc,
  imageAlt,
  blurDataURL,
  aspectRatio = 4 / 3,
  placeLabel,
  caption,
  yearLabel,
  priority = false,
  size = 'default',
  className,
  imageLayoutId,
  imageLayoutTransition,
  ImageMorphFrame,
  LinkComponent = DefaultLink,
  ImageComponent = DefaultImage,
}: PhotographyCardViewProps) {
  const reduceMotion = useReducedMotion();
  const alt = imageAlt ?? title ?? 'Photograph';
  const isLarge = size === 'large';
  const hasBlur = Boolean(blurDataURL);

  const imageEl = (
    <ImageComponent
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={priority ? 'high' : 'auto'}
      className='object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]'
      sizes={
        isLarge
          ? '(max-width: 1024px) 100vw, 66vw'
          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
      }
      placeholder={hasBlur ? 'blur' : 'empty'}
      blurDataURL={blurDataURL ?? undefined}
    />
  );

  const effectiveLayoutId = imageLayoutId && !reduceMotion ? imageLayoutId : undefined;
  const morphFrameClassName = 'relative h-full w-full overflow-hidden';

  const imageNode =
    effectiveLayoutId && ImageMorphFrame ? (
      <ImageMorphFrame
        layoutId={effectiveLayoutId}
        transition={imageLayoutTransition}
        className={morphFrameClassName}
      >
        {imageEl}
      </ImageMorphFrame>
    ) : effectiveLayoutId ? (
      <motion.div
        layoutId={effectiveLayoutId}
        initial={false}
        transition={imageLayoutTransition}
        className={morphFrameClassName}
      >
        <motion.div layout='position' className='relative h-full w-full'>
          {imageEl}
        </motion.div>
      </motion.div>
    ) : (
      imageEl
    );

  return (
    <article className={cn('group', className)}>
      <LinkComponent href={href} className='block' aria-label={title ?? 'View photograph'}>
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-xl bg-surface-subtle',
            'shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-border/20',
            'transition-all duration-500 ease-out',
            'group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.14)] group-hover:ring-accent/25',
            'dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] dark:group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.5)]',
          )}
          style={{ aspectRatio }}
        >
          {imageNode}

          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100'
            aria-hidden
          />

          {yearLabel ? (
            <span className='absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-white/95 backdrop-blur-md'>
              {yearLabel}
            </span>
          ) : null}

          <div
            className={cn(
              'absolute inset-x-0 bottom-0 z-10 p-4 pt-12',
              'translate-y-2 opacity-0 transition-all duration-500 ease-out',
              'group-hover:translate-y-0 group-hover:opacity-100',
              'group-focus-within:translate-y-0 group-focus-within:opacity-100',
              !isLarge && 'sm:opacity-100 sm:translate-y-0',
            )}
          >
            <h2
              className={cn(
                'font-serif font-bold leading-snug text-white text-pretty drop-shadow-sm',
                isLarge ? 'text-2xl sm:text-[1.65rem]' : 'text-lg',
              )}
            >
              {title}
            </h2>
            {placeLabel ? (
              <p className='mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75'>
                {placeLabel}
              </p>
            ) : null}
            {caption && isLarge ? (
              <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-white/80 text-pretty'>
                {caption}
              </p>
            ) : null}
          </div>
        </div>

        {isLarge ? (
          <div className='sr-only'>
            {title}
            {placeLabel ? ` — ${placeLabel}` : ''}
          </div>
        ) : (
          <p className='mt-3 px-0.5 font-serif text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:sr-only'>
            {title}
          </p>
        )}
      </LinkComponent>
    </article>
  );
}
