'use client';

import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import {
  getPaintingImageLqip,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

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
  const isForSale = hit.isForSale === true || hit.hasStoreLink === true;

  const layout = useMemo(
    () =>
      resolvePaintingCardLayout({
        format: hit.format,
        aspectRatio: hit.image?.aspectRatio ?? null,
      }),
    [hit.format, hit.image?.aspectRatio],
  );

  const imageSrc = useMemo(() => urlForPaintingCard(hit.image, layout), [hit.image, layout]);
  const lqip = useMemo(() => getPaintingImageLqip(hit.image), [hit.image]);

  return (
    <Link
      href={`/paintings/${slug}`}
      className={cn(
        'relative block overflow-hidden rounded-xl bg-surface border border-border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isForSale && !showNsfwCover && 'ring-2 ring-accent/50 border-accent/40',
        layout.aspectClass,
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
          sizes='(min-width: 1040px) 20vw, 50vw'
          priority={index < 2}
          fetchPriority={index < 2 ? 'high' : 'auto'}
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          quality={75}
          loading={index < 6 ? 'eager' : 'lazy'}
          className='object-cover'
        />
      ) : (
        <div className='absolute inset-0 bg-surface-subtle' aria-hidden />
      )}

      {showNsfwCover ? (
        <div className='pointer-events-none absolute inset-0 z-[1] bg-background/70' aria-hidden />
      ) : null}
    </Link>
  );
}

export const SearchGridCard = memo(SearchGridCardInner);
