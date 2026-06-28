'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import {
  getPaintingImageLqip,
  type PaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

/** Fixed square crop for the search grid — avoids per-card layout work on filter updates. */
const SEARCH_GRID_LAYOUT: PaintingCardLayout = {
  format: 'square',
  aspectClass: 'aspect-square',
  aspectRatio: 1,
  cropWidth: 640,
  cropHeight: 640,
};

const searchGridImageUrlCache = new Map<string, string>();

function getSearchGridImageUrl(image: SearchGridHit['image']): string | null {
  const ref = image?.asset?._ref;
  if (!ref) return null;

  const cached = searchGridImageUrlCache.get(ref);
  if (cached) return cached;

  const url = urlForPaintingCard(image, SEARCH_GRID_LAYOUT);
  if (url) searchGridImageUrlCache.set(ref, url);
  return url ?? null;
}

export type SearchGridHit = {
  objectID: string;
  slug?: string;
  title?: string;
  image?: {
    aspectRatio?: number | null;
    asset?: { _ref?: string; lqip?: string };
    lqip?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
  format?: string | null;
  isNSFW?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  imageSrc?: string | null;
};

type SearchGridCardProps = {
  hit: SearchGridHit;
  index: number;
  /** When true, NSFW blur is lifted (user filtered for mature content). */
  nsfwRevealed?: boolean;
};

function SearchGridCardInner({ hit, index, nsfwRevealed = false }: SearchGridCardProps) {
  const title = hit.title ?? 'Painting';
  const slug = hit.slug ?? '';
  const isNsfw = hit.isNSFW === true;
  const showNsfwCover = isNsfw && !nsfwRevealed;
  const imageSrc = hit.imageSrc ?? getSearchGridImageUrl(hit.image);
  const lqip = getPaintingImageLqip(hit.image);

  return (
    <Link
      href={`/paintings/${slug}`}
      className={cn(
        'relative block w-full overflow-hidden rounded-xl bg-surface border border-border/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'transition-[border-color,box-shadow] duration-300 hover:border-border hover:shadow-md',
        SEARCH_GRID_LAYOUT.aspectClass,
      )}
    >
      <span className='sr-only'>
        View painting: {title}
        {isNsfw ? ' (mature content)' : ''}
      </span>

      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=''
          aria-hidden
          fill
          sizes='(min-width: 768px) 33vw, 50vw'
          priority={index < 2}
          fetchPriority={index < 2 ? 'high' : 'auto'}
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          quality={70}
          loading={index < 6 ? 'eager' : 'lazy'}
          className='object-cover'
        />
      ) : (
        <div className='absolute inset-0 bg-surface-subtle' aria-hidden />
      )}

      {showNsfwCover ? (
        <div className='pointer-events-none absolute inset-0 z-1 bg-background/70' aria-hidden />
      ) : null}
    </Link>
  );
}

export const SearchGridCard = memo(
  SearchGridCardInner,
  (prev, next) =>
    prev.hit.objectID === next.hit.objectID &&
    prev.index === next.index &&
    prev.nsfwRevealed === next.nsfwRevealed &&
    prev.hit.isForSale === next.hit.isForSale &&
    prev.hit.isNSFW === next.hit.isNSFW &&
    prev.hit.hasStoreLink === next.hit.hasStoreLink,
);
