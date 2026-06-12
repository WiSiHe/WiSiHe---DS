'use client';

import { IconArrowRight, IconPhoto } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForImage } from '@/sanity/lib/utils';
import type { TravelPhotoItem } from './lifeJourneyTypes';

type CountryPhotoStripProps = {
  photos: TravelPhotoItem[];
  country: string;
  className?: string;
};

export function CountryPhotoStrip({ photos, country, className }: CountryPhotoStripProps) {
  if (photos.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className='flex items-center justify-between gap-3'>
        <p className='flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted'>
          <IconPhoto className='size-3.5 text-accent' stroke={1.75} aria-hidden />
          From the gallery
        </p>
        <Link
          href='/photography'
          className='group inline-flex items-center gap-1 text-[11px] font-medium text-accent transition-colors hover:text-accent-hover'
        >
          View all
          <IconArrowRight
            className='size-3.5 transition-transform group-hover:translate-x-0.5'
            stroke={2}
            aria-hidden
          />
        </Link>
      </div>

      <ul className='flex gap-2.5 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none]'>
        {photos.slice(0, 6).map(photo => {
          const imageUrl = photo.image
            ? urlForImage(photo.image)?.width(560).height(380).quality(82).auto('format').url()
            : null;
          if (!imageUrl) return null;

          const label = photo.title ?? photo.place?.name ?? photo.placeName;
          const href = photo.slug ? `/photography/${photo.slug}` : null;

          const thumb = (
            <>
              <Image
                src={imageUrl}
                alt={photo.image?.alt ?? photo.title ?? `Photo from ${country}`}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105'
                sizes='176px'
                placeholder={photo.image?.lqip ? 'blur' : 'empty'}
                blurDataURL={photo.image?.lqip ?? undefined}
              />
              <div
                className='absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100'
                aria-hidden
              />
              {label ? (
                <span className='absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-6 text-[11px] font-medium leading-snug text-foreground line-clamp-2'>
                  {label}
                </span>
              ) : null}
            </>
          );

          return (
            <li
              key={photo._id}
              className='relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-border/40 shadow-sm ring-1 ring-black/5'
            >
              {href ? (
                <Link
                  href={href}
                  className='group relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  aria-label={photo.title ?? `View photo from ${country}`}
                >
                  {thumb}
                </Link>
              ) : (
                <div className='relative h-full w-full'>{thumb}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
