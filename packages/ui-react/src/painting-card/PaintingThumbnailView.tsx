'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type * as React from 'react';
import { Badge } from '../badge/Badge';
import { BrushRevealLayer } from './brush-reveal/BrushRevealLayer';
import { BrushRevealWrap } from './brush-reveal/BrushRevealWrap';
import { NsfwContentIndicator } from './brush-reveal/NsfwContentIndicator';
import { type BrushStrokeColorSet, getBrushStrokeColors } from './brush-stroke/brushStrokeColors';
import type { PaintingFormat } from './layout';
import { getNsfwImageBlurClass } from './nsfwCover';

const IMAGE_RADIUS_CLASS = 'rounded-xl';

export type PaintingThumbnailImageComponentProps = {
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
  loading?: 'eager' | 'lazy';
};

export type PaintingThumbnailViewProps = {
  title: string;
  href: string;
  imageSrc?: string | null;
  blurDataURL?: string;
  aspectClass?: string;
  priority?: boolean;
  eager?: boolean;
  /** Blur image when NSFW filter is off. */
  showNsfwCover?: boolean;
  nsfwCompactLabel?: string;
  nsfwScreenReaderLabel?: string;
  /** Opt-in grid band hover. */
  brushReveal?: boolean;
  strokeColors?: BrushStrokeColorSet;
  strokeVariantIndex?: number;
  revealSeed?: number;
  paintedAt?: string | null;
  paintingFormat?: PaintingFormat;
  availableForSale?: boolean;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  ImageComponent?: React.ComponentType<PaintingThumbnailImageComponentProps>;
  /** Enables shared layout morph into painting detail hero. */
  imageLayoutId?: string;
  imageLayoutTransition?: Transition;
  className?: string;
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

function DefaultImage({ fill, className, alt = '', src }: PaintingThumbnailImageComponentProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined;
  return <img src={src} alt={alt} className={className} style={fillStyle} />;
}

function CompactPrintBadge() {
  return (
    <Badge
      size='sm'
      variant='accent'
      className='h-5 px-2 text-[8px] leading-none tracking-wider'
      aria-hidden
    >
      Print
    </Badge>
  );
}

/** Compact painting thumbnail with optional grid band hover. */
export function PaintingThumbnailView({
  title,
  href,
  imageSrc,
  blurDataURL: _blurDataURL,
  aspectClass = 'aspect-[3/4]',
  priority = false,
  eager = false,
  showNsfwCover = false,
  nsfwCompactLabel,
  nsfwScreenReaderLabel,
  brushReveal = false,
  strokeColors,
  strokeVariantIndex = 0,
  revealSeed,
  paintedAt,
  paintingFormat = 'portrait',
  availableForSale = false,
  LinkComponent = DefaultLink,
  ImageComponent = DefaultImage,
  imageLayoutId,
  imageLayoutTransition,
  className,
}: PaintingThumbnailViewProps) {
  const reduceMotion = useReducedMotion();
  const displayTitle = title.trim() || 'Untitled painting';
  const effectiveLayoutId = imageLayoutId && !reduceMotion ? imageLayoutId : undefined;
  const colors = strokeColors ?? getBrushStrokeColors(strokeVariantIndex);

  const image = imageSrc ? (
    <ImageComponent
      src={imageSrc}
      alt={displayTitle}
      fill
      sizes='(min-width: 640px) 33vw, 46vw'
      priority={priority}
      fetchPriority={priority ? 'high' : 'auto'}
      placeholder='empty'
      quality={82}
      loading={eager ? 'eager' : 'lazy'}
      className={cn('object-cover', showNsfwCover && getNsfwImageBlurClass('thumbnail'))}
    />
  ) : (
    <div
      className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated'
      aria-hidden
    />
  );

  const imageFrame = (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-transparent',
        IMAGE_RADIUS_CLASS,
        aspectClass,
      )}
    >
      {imageSrc && effectiveLayoutId ? (
        <motion.div
          layoutId={effectiveLayoutId}
          initial={false}
          transition={imageLayoutTransition}
          className='absolute inset-0'
        >
          <motion.div layout='position' className='relative h-full w-full'>
            {image}
          </motion.div>
        </motion.div>
      ) : (
        image
      )}

      {brushReveal && strokeColors ? (
        <BrushRevealLayer
          {...colors}
          strokeVariantIndex={strokeVariantIndex}
          revealSeed={revealSeed}
          paintingFormat={paintingFormat}
          title={displayTitle}
          year={paintedAt ?? null}
        />
      ) : null}

      {showNsfwCover || availableForSale ? (
        <div
          className='pointer-events-none absolute inset-x-2 top-2 z-10 flex items-start justify-between gap-2'
          data-card-badges
        >
          {showNsfwCover ? (
            <NsfwContentIndicator
              label={nsfwCompactLabel ?? ''}
              compact
              className='min-w-0 shrink-0'
            />
          ) : (
            <span className='shrink-0' aria-hidden />
          )}
          {availableForSale ? <CompactPrintBadge /> : null}
        </div>
      ) : null}
    </div>
  );

  const content = (
    <article className={cn('w-full', className)}>
      <LinkComponent
        href={href}
        className={cn(
          'group group/painting block',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          IMAGE_RADIUS_CLASS,
        )}
      >
        {imageFrame}

        {!brushReveal && !showNsfwCover ? (
          <div className='flex min-h-[2.75rem] items-center justify-center px-1 py-2'>
            <h3 className='line-clamp-2 w-full text-center font-sans text-[13px] font-semibold leading-snug text-foreground transition-colors duration-200 group-hover/painting:text-accent'>
              {displayTitle}
            </h3>
          </div>
        ) : null}

        {showNsfwCover && nsfwScreenReaderLabel ? (
          <span className='sr-only'>{nsfwScreenReaderLabel}</span>
        ) : null}
        {availableForSale ? <span className='sr-only'>Available as print</span> : null}
      </LinkComponent>
    </article>
  );

  if (!brushReveal) return content;

  return <BrushRevealWrap enabled={brushReveal}>{content}</BrushRevealWrap>;
}
