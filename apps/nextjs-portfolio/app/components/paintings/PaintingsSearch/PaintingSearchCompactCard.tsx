'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { NsfwBrushCover } from '@/app/components/paintings/BrushReveal/NsfwBrushCover';
import { NsfwMatureCaption } from '@/app/components/paintings/BrushReveal/NsfwMatureCaption';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { NSFW_IMAGE_BLUR_CLASS } from '@/lib/paintings/nsfwCover';
import {
  getPaintingImageLqip,
  type PaintingCardLayout,
  paintingBrushSeed,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

/** Fixed 4:3 crop for mobile/tablet search grid — maximises visible art area. */
export const SEARCH_COMPACT_LAYOUT: PaintingCardLayout = {
  format: 'landscape',
  aspectClass: 'aspect-[4/3]',
  aspectRatio: 4 / 3,
  cropWidth: 900,
  cropHeight: 675,
};

const searchCompactImageUrlCache = new Map<string, string>();

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
  isNsfw?: boolean;
  isNsfwFilterActive?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  paintingId?: string;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity palette shape
  palette?: any;
};

function getSearchCompactImageUrl(image: PaintingImage | null | undefined): string | null {
  const ref = image?.asset?._ref;
  if (!ref) return null;

  const cached = searchCompactImageUrlCache.get(ref);
  if (cached) return cached;

  const url = urlForPaintingCard(image, SEARCH_COMPACT_LAYOUT);
  if (url) searchCompactImageUrlCache.set(ref, url);
  return url ?? null;
}

function PaintingSearchCompactCardInner({
  title,
  slug,
  image,
  index,
  isNsfw = false,
  isNsfwFilterActive = false,
  isForSale = false,
  hasStoreLink = false,
  paintingId,
  palette,
}: PaintingSearchCompactCardProps) {
  const displayTitle = title.trim() || 'Untitled painting';
  const showNsfwCover = isNsfw && !isNsfwFilterActive;
  const availableForSale = isForSale || hasStoreLink;
  const imageSrc = getSearchCompactImageUrl(image);
  const lqip = getPaintingImageLqip(image);
  const brushSeed = paintingBrushSeed(paintingId ?? slug ?? title);
  const strokeColors = getBrushStrokeColors(brushSeed, palette);

  return (
    <article className='w-full'>
      <Link
        href={`/paintings/${slug}`}
        className={cn(
          'group block overflow-hidden rounded-xl border border-border/40 bg-surface',
          'transition-[border-color,box-shadow] duration-300 hover:border-border hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        <div
          className={cn(
            'relative w-full overflow-hidden bg-neutral-900',
            SEARCH_COMPACT_LAYOUT.aspectClass,
          )}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=''
              aria-hidden
              fill
              sizes='(min-width: 640px) 33vw, 50vw'
              priority={index < 6}
              fetchPriority={index < 6 ? 'high' : 'auto'}
              placeholder={lqip ? 'blur' : 'empty'}
              blurDataURL={lqip}
              quality={80}
              loading={index < 6 ? 'eager' : 'lazy'}
              className={cn(
                'object-cover transition-transform duration-500 group-hover:scale-[1.02]',
                showNsfwCover && NSFW_IMAGE_BLUR_CLASS,
              )}
            />
          ) : (
            <div
              className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated'
              aria-hidden
            />
          )}

          {showNsfwCover ? (
            <NsfwBrushCover {...strokeColors} strokeVariantIndex={brushSeed} />
          ) : null}

          {availableForSale ? (
            <span
              className='absolute right-2 top-2 z-[2] rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-contrast shadow-sm'
              aria-hidden
            >
              Print
            </span>
          ) : null}
        </div>

        <div className='border-t border-border px-3 py-2.5'>
          <h3 className='line-clamp-2 font-sans text-sm font-semibold leading-snug text-foreground group-hover:text-accent'>
            {displayTitle}
          </h3>
          {showNsfwCover ? <NsfwMatureCaption className='mt-1' /> : null}
          {availableForSale ? <span className='sr-only'>Available as print</span> : null}
        </div>
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
    prev.isNsfw === next.isNsfw &&
    prev.isNsfwFilterActive === next.isNsfwFilterActive &&
    prev.isForSale === next.isForSale &&
    prev.hasStoreLink === next.hasStoreLink &&
    prev.paintingId === next.paintingId &&
    prev.image?.asset?._ref === next.image?.asset?._ref,
);
