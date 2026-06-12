'use client';

import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import type { TravelPhotoItem } from './lifeJourneyTypes';

type CountryPhotoStripProps = {
  photos: TravelPhotoItem[];
  country: string;
};

export function CountryPhotoStrip({ photos, country }: CountryPhotoStripProps) {
  if (photos.length === 0) return null;

  return (
    <div className='mt-5 space-y-2'>
      <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-muted'>
        Photos from {country}
      </p>
      <ul className='flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {photos.slice(0, 6).map(photo => {
          const imageUrl = photo.image
            ? urlForImage(photo.image)?.width(480).height(320).quality(80).url()
            : null;
          if (!imageUrl) return null;

          const label = [photo.title, photo.placeName].filter(Boolean).join(' · ');

          return (
            <li
              key={photo._id}
              className='relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-border/50'
            >
              <Image
                src={imageUrl}
                alt={photo.image?.alt ?? photo.title ?? `Photo from ${country}`}
                fill
                className='object-cover'
                sizes='144px'
                placeholder={photo.image?.lqip ? 'blur' : 'empty'}
                blurDataURL={photo.image?.lqip ?? undefined}
              />
              {label ? (
                <span className='pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-2 py-1.5 text-[10px] font-medium text-foreground line-clamp-2'>
                  {label}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
