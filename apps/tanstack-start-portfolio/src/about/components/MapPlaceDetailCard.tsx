'use client';

import { IconMapPin, IconX } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from '@/components/ui/Image';
import { urlForImage } from '@/lib/sanity';
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
  return urlForImage(image)?.width(960).height(640).quality(88).auto('format').url() ?? null;
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
        'relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface/50 shadow-lg shadow-black/[0.04] ring-1 ring-white/10',
        'max-lg:min-h-0',
        'lg:min-h-0 lg:h-full',
        className,
      )}
      aria-label={hasContent ? `Details for ${title}` : 'Place details'}
    >
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-accent)_0%,transparent_55%)] opacity-[0.07]'
        aria-hidden
      />

      {!hasContent ? (
        <div className='relative flex min-h-[min(240px,36svh)] flex-col items-center justify-center gap-4 px-6 py-10 text-center sm:min-h-[280px] sm:px-8 sm:py-12 lg:min-h-0 lg:flex-1'>
          <div className='flex size-14 items-center justify-center rounded-2xl border border-border/50 bg-background/80 shadow-sm'>
            <IconMapPin className='size-6 text-accent' stroke={1.5} aria-hidden />
          </div>
          <div className='space-y-2 max-w-xs'>
            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-accent'>
              Pick a place
            </p>
            <p className='font-serif text-2xl font-bold text-foreground'>Where did you stop?</p>
            <p className='text-sm leading-relaxed text-foreground-subtle text-pretty'>
              Tap a dot on the map to see the city, country, and any photos or facts saved for that
              stop.
            </p>
          </div>
        </div>
      ) : (
        <div className='relative flex min-h-0 flex-1 flex-col'>
          {imageUrl ? (
            <div className='shrink-0 p-4 pb-0 sm:p-5 sm:pb-0'>
              <div className='relative aspect-16/10 overflow-hidden rounded-xl ring-1 ring-border/50 shadow-md'>
                <Image
                  src={imageUrl}
                  alt={title ?? 'Place'}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 420px'
                  placeholder={image?.lqip ? 'blur' : 'empty'}
                  blurDataURL={image?.lqip ?? undefined}
                />
                <div
                  className='absolute inset-0 bg-linear-to-t from-background/50 via-transparent to-transparent'
                  aria-hidden
                />
              </div>
            </div>
          ) : null}

          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 sm:px-6 sm:py-6'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0 space-y-1'>
                {country ? (
                  <p className='inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent'>
                    <span className='size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]' />
                    {country}
                  </p>
                ) : null}
                <h3 className='font-serif text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.75rem]'>
                  {title}
                </h3>
                {subtitle ? (
                  <p className='text-sm text-foreground-muted text-pretty'>{subtitle}</p>
                ) : null}
              </div>
              {onClear ? (
                <button
                  type='button'
                  onClick={onClear}
                  className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground-muted shadow-sm transition-all hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  aria-label='Clear selection'
                >
                  <IconX className='size-4' stroke={2} aria-hidden />
                </button>
              ) : null}
            </div>

            {hasFacts ? (
              <PlaceFactsGrid funFact={funFact} stats={stats} className='mt-5 sm:mt-6' />
            ) : (
              <div className='mt-5 rounded-xl border border-dashed border-border/50 bg-background/40 px-4 py-5 sm:mt-6'>
                <p className='text-sm leading-relaxed text-foreground-subtle text-pretty'>
                  No notes saved for this stop yet — pick another pin or explore a different country
                  on the map.
                </p>
              </div>
            )}

            {notes ? (
              <p className='mt-5 border-t border-border/40 pt-5 text-sm leading-relaxed text-foreground-subtle text-pretty'>
                {notes}
              </p>
            ) : null}

            {travelPhotos.length > 0 ? (
              <CountryPhotoStrip
                photos={travelPhotos}
                country={country ?? title ?? 'this place'}
                className='mt-auto border-t border-border/40 pt-5 sm:pt-6'
              />
            ) : null}
          </div>
        </div>
      )}
    </aside>
  );
}
