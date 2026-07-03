'use client';

import { cleanTagName, cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import { NsfwBrushCover } from '@/app/components/paintings/BrushReveal/NsfwBrushCover';
import { NsfwContentIndicator } from '@/app/components/paintings/BrushReveal/NsfwContentIndicator';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import {
  getNsfwImageBlurClass,
  NSFW_MATURE_LABEL,
  resolveNsfwCompactLabel,
  resolveNsfwRatingLabel,
} from '@/lib/paintings/nsfwCover';
import {
  getPaintingImageLqip,
  type PaintingCardLayout,
  paintingBrushSeed,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

const searchCompactImageUrlCache = new Map<string, string>();
const IMAGE_RADIUS_CLASS = 'rounded-xl';

type PaintingImage = {
  aspectRatio?: number | null;
  asset?: { _ref?: string; lqip?: string };
  lqip?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type PaintingSearchCompactCardProps = {
  title: string;
  slug: string;
  image?: PaintingImage | null;
  index: number;
  format?: string | null;
  isNsfw?: boolean;
  isNsfwFilterActive?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  paintingId?: string;
  tags?: string[];
  // biome-ignore lint/suspicious/noExplicitAny: Sanity palette shape
  palette?: any;
};

function getSearchCompactImageUrl(
  image: PaintingImage | null | undefined,
  layout: PaintingCardLayout,
): string | null {
  const ref = image?.asset?._ref;
  if (!ref) return null;

  const cacheKey = `${ref}:${layout.format}`;
  const cached = searchCompactImageUrlCache.get(cacheKey);
  if (cached) return cached;

  const url = urlForPaintingCard(image, layout);
  if (url) searchCompactImageUrlCache.set(cacheKey, url);
  return url ?? null;
}

const COMPACT_IMAGE_BADGE_CLASS =
  'inline-flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-[8px] font-bold uppercase leading-none tracking-wider';

function CompactPrintBadge() {
  return (
    <span
      className={cn(COMPACT_IMAGE_BADGE_CLASS, 'bg-accent/90 text-accent-contrast')}
      aria-hidden
    >
      Print
    </span>
  );
}

function PaintingSearchCompactCardInner({
  title,
  slug,
  image,
  index,
  format,
  isNsfw = false,
  isNsfwFilterActive = false,
  isForSale = false,
  hasStoreLink = false,
  paintingId,
  tags = [],
  palette,
}: PaintingSearchCompactCardProps) {
  const reduceMotion = useReducedMotion();
  const displayTitle = title.trim() || 'Untitled painting';
  const showNsfwCover = isNsfw && !isNsfwFilterActive;
  const availableForSale = isForSale || hasStoreLink;
  const layout = useMemo(
    () =>
      resolvePaintingCardLayout({
        format,
        aspectRatio: image?.aspectRatio ?? null,
      }),
    [format, image?.aspectRatio],
  );
  const imageSrc = getSearchCompactImageUrl(image, layout);
  const lqip = getPaintingImageLqip(image);
  const brushSeed = paintingBrushSeed(paintingId ?? slug ?? title);
  const strokeColors = getBrushStrokeColors(brushSeed, palette);
  const cleanedTags = useMemo(() => tags.map(tag => cleanTagName(tag)).filter(Boolean), [tags]);
  const nsfwLabel = resolveNsfwRatingLabel(cleanedTags);
  const nsfwCompactLabel = resolveNsfwCompactLabel(cleanedTags);
  const imageLayoutId =
    !reduceMotion && displayTitle ? contentImageLayoutId(displayTitle) : undefined;

  return (
    <article className='w-full'>
      <Link
        href={`/paintings/${slug}`}
        className={cn(
          'group group/painting block',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          IMAGE_RADIUS_CLASS,
        )}
      >
        <div
          className={cn(
            'relative isolate w-full overflow-hidden bg-transparent',
            IMAGE_RADIUS_CLASS,
            layout.aspectClass,
          )}
        >
          {imageSrc ? (
            imageLayoutId ? (
              <motion.div
                layoutId={imageLayoutId}
                initial={false}
                transition={sharedLayoutTransition}
                className='absolute inset-0'
              >
                <Image
                  src={imageSrc}
                  alt={displayTitle}
                  fill
                  sizes='(min-width: 640px) 33vw, 46vw'
                  priority={index < 4}
                  fetchPriority={index < 4 ? 'high' : 'auto'}
                  placeholder={lqip ? 'blur' : 'empty'}
                  blurDataURL={lqip}
                  quality={82}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  className={cn(
                    'object-cover',
                    showNsfwCover && getNsfwImageBlurClass('thumbnail'),
                  )}
                />
              </motion.div>
            ) : (
              <Image
                src={imageSrc}
                alt={displayTitle}
                fill
                sizes='(min-width: 640px) 33vw, 46vw'
                priority={index < 4}
                fetchPriority={index < 4 ? 'high' : 'auto'}
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                quality={82}
                loading={index < 4 ? 'eager' : 'lazy'}
                className={cn('object-cover', showNsfwCover && getNsfwImageBlurClass('thumbnail'))}
              />
            )
          ) : (
            <div
              className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated'
              aria-hidden
            />
          )}

          {showNsfwCover ? (
            <NsfwBrushCover {...strokeColors} strokeVariantIndex={brushSeed} variant='thumbnail' />
          ) : null}

          {showNsfwCover || availableForSale ? (
            <div
              className='pointer-events-none absolute inset-x-2 top-2 z-10 flex items-center justify-between gap-2'
              data-card-badges
            >
              {showNsfwCover ? (
                <NsfwContentIndicator label={nsfwCompactLabel} compact className='min-w-0' />
              ) : (
                <span className='shrink-0' aria-hidden />
              )}
              {availableForSale ? <CompactPrintBadge /> : null}
            </div>
          ) : null}
        </div>

        <div className='flex min-h-[2.75rem] items-center justify-center px-1 py-2'>
          <h3 className='line-clamp-2 w-full text-center font-sans text-[13px] font-semibold leading-snug text-foreground transition-colors duration-200 group-hover/painting:text-accent'>
            {displayTitle}
          </h3>
        </div>

        {showNsfwCover ? (
          <span className='sr-only'>
            {nsfwLabel === NSFW_MATURE_LABEL ? NSFW_MATURE_LABEL : nsfwLabel}
          </span>
        ) : null}
        {availableForSale ? <span className='sr-only'>Available as print</span> : null}
      </Link>
    </article>
  );
}

export const PaintingSearchCompactCard = memo(
  PaintingSearchCompactCardInner,
  (prev, next) =>
    prev.slug === next.slug &&
    prev.title === next.title &&
    prev.index === next.index &&
    prev.format === next.format &&
    prev.isNsfw === next.isNsfw &&
    prev.isNsfwFilterActive === next.isNsfwFilterActive &&
    prev.isForSale === next.isForSale &&
    prev.hasStoreLink === next.hasStoreLink &&
    prev.paintingId === next.paintingId &&
    prev.tags === next.tags &&
    prev.image?.asset?._ref === next.image?.asset?._ref &&
    prev.image?.aspectRatio === next.image?.aspectRatio,
);
