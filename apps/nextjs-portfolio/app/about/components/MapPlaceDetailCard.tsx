'use client';

import { IconMapPin } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import { CountryPhotoStrip } from './CountryPhotoStrip';
import type { PlaceImage, PlaceStat, TravelPhotoItem } from './lifeJourneyTypes';
import { PlaceFactsGrid } from './PlaceFactsGrid';

type MapPlaceDetailCardProps = {
  title?: string | null;
  subtitle?: string | null;
  country?: string | null;
  notes?: string | null;
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  image?: PlaceImage | null;
  travelPhotos?: TravelPhotoItem[];
  onClear?: () => void;
  className?: string;
};

function resolveImageUrl(image: PlaceImage | null | undefined) {
  if (!image) return null;
  return urlForImage(image)?.width(800).height(520).quality(82).url() ?? null;
}

export function MapPlaceDetailCard({
  title,
  subtitle,
  country,
  notes,
  funFact,
  stats,
  image,
  travelPhotos = [],
  onClear,
  className,
}: MapPlaceDetailCardProps) {
  const imageUrl = resolveImageUrl(image);
  const hasContent = Boolean(title);
  const statItems = stats ?? [];
  const hasFacts = Boolean(funFact || notes || statItems.length > 0 || imageUrl);

  return (
    <aside
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface/30 shadow-sm',
        'max-lg:min-h-0',
        'lg:min-h-0 lg:h-full',
        className,
      )}
      aria-label={hasContent ? `Details for ${title}` : 'Place details'}
    >
      {!hasContent ? (
        <div className='flex min-h-[min(240px,36svh)] flex-col items-center justify-center gap-4 px-6 py-10 text-center sm:min-h-[280px] sm:px-8 sm:py-12 lg:min-h-0 lg:flex-1'>
          <div className='flex size-12 items-center justify-center rounded-full border border-border/60 bg-background/80'>
            <IconMapPin className='size-5 text-foreground-muted' stroke={1.75} aria-hidden />
          </div>
          <div className='space-y-2 max-w-xs'>
            <p className='font-mono text-[10px] uppercase tracking-[0.24em] text-accent'>
              Pick a place
            </p>
            <p className='font-serif text-xl font-bold text-foreground'>Where did you stop?</p>
            <p className='text-sm leading-relaxed text-foreground-subtle text-pretty'>
              Tap a dot on the map to see the city, country, and any photos or facts saved for that
              stop.
            </p>
          </div>
        </div>
      ) : (
        <>
          {imageUrl ? (
            <div className='relative aspect-16/10 w-full shrink-0 border-b border-border/50 lg:aspect-5/4'>
              <Image
                src={imageUrl}
                alt={title ?? 'Place'}
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 400px'
                placeholder={image?.lqip ? 'blur' : 'empty'}
                blurDataURL={image?.lqip ?? undefined}
              />
            </div>
          ) : null}

          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-6 sm:py-7'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 space-y-1.5'>
                {country ? (
                  <p className='font-mono text-[10px] uppercase tracking-[0.24em] text-neon-yellow-500'>
                    {country}
                  </p>
                ) : null}
                <h3 className='font-serif text-2xl font-bold leading-tight text-foreground sm:text-[1.65rem]'>
                  {title}
                </h3>
                {subtitle ? (
                  <p className='text-sm leading-relaxed text-foreground-muted text-pretty'>
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {onClear ? (
                <button
                  type='button'
                  onClick={onClear}
                  className='shrink-0 rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground-muted transition-colors hover:bg-surface hover:text-foreground -mr-1'
                >
                  Clear
                </button>
              ) : null}
            </div>

            {hasFacts ? (
              <PlaceFactsGrid funFact={funFact} stats={stats} className='mt-5 sm:mt-6' />
            ) : (
              <div className='mt-5 rounded-xl border border-dashed border-border/60 bg-background/60 px-4 py-4 sm:mt-6 sm:px-5 sm:py-4'>
                <p className='text-sm leading-relaxed text-foreground-subtle text-pretty'>
                  No notes saved for this stop yet — pick another pin or explore a different country
                  on the map.
                </p>
              </div>
            )}

            {notes ? (
              <p className='mt-5 text-sm leading-relaxed text-foreground-subtle text-pretty sm:mt-6'>
                {notes}
              </p>
            ) : null}

            {travelPhotos.length > 0 ? (
              <CountryPhotoStrip photos={travelPhotos} country={country ?? title ?? 'this place'} />
            ) : null}
          </div>
        </>
      )}
    </aside>
  );
}
