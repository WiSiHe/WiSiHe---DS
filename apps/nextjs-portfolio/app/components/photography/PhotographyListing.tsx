'use client';

import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { PhotographyCard } from './PhotographyCard';

type PhotographyListingProps = {
  photos: PhotographyListQueryResult;
};

type CountryFilter = {
  code: string;
  name: string;
  count: number;
};

function buildCountryFilters(photos: PhotographyListQueryResult): CountryFilter[] {
  const counts = new Map<string, CountryFilter>();

  for (const photo of photos) {
    const code = photo.place?.countryCode?.trim().toUpperCase();
    const name = photo.place?.countryName?.trim();
    if (!code || !name) continue;

    const existing = counts.get(code);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(code, { code, name, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function PhotographyListing({ photos }: PhotographyListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCountry = searchParams.get('country')?.toUpperCase() ?? null;

  const countryFilters = useMemo(() => buildCountryFilters(photos), [photos]);

  const setCountryFilter = useCallback(
    (code: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (code) params.set('country', code);
      else params.delete('country');
      const query = params.toString();
      router.push(query ? `/photography?${query}` : '/photography', { scroll: false });
    },
    [router, searchParams],
  );

  const filteredPhotos = useMemo(() => {
    if (!activeCountry) return photos;
    return photos.filter(photo => photo.place?.countryCode?.trim().toUpperCase() === activeCountry);
  }, [activeCountry, photos]);

  const featuredPhoto = useMemo(() => {
    if (activeCountry) return null;
    return filteredPhotos.find(photo => photo.isFeatured) ?? null;
  }, [activeCountry, filteredPhotos]);

  const gridPhotos = useMemo(() => {
    if (!featuredPhoto) return filteredPhotos;
    return filteredPhotos.filter(photo => photo._id !== featuredPhoto._id);
  }, [filteredPhotos, featuredPhoto]);

  if (!photos.length) return null;

  return (
    <div className='space-y-10'>
      {countryFilters.length > 1 ? (
        <div className='space-y-3'>
          <div className='flex flex-wrap items-end justify-between gap-3'>
            <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-muted'>
              Filter by country
            </p>
            <p className='text-sm text-foreground-muted'>
              {filteredPhotos.length} of {photos.length} photo
              {photos.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setCountryFilter(null)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                activeCountry === null
                  ? 'border-accent bg-accent text-accent-contrast shadow-sm'
                  : 'border-border/60 bg-surface/60 text-foreground-subtle hover:border-accent/40 hover:text-accent',
              )}
            >
              All places
            </button>
            {countryFilters.map(country => (
              <button
                key={country.code}
                type='button'
                onClick={() =>
                  setCountryFilter(country.code === activeCountry ? null : country.code)
                }
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                  activeCountry === country.code
                    ? 'border-accent bg-accent text-accent-contrast shadow-sm'
                    : 'border-border/60 bg-surface/60 text-foreground-subtle hover:border-accent/40 hover:text-accent',
                )}
              >
                {country.name}
                <span className='ml-1.5 text-[11px] opacity-70'>{country.count}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {filteredPhotos.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center'>
          <p className='font-serif text-2xl font-bold text-foreground'>No photos in this country</p>
          <p className='mt-2 text-foreground-muted'>
            Try another filter or browse the full gallery.
          </p>
          <button
            type='button'
            onClick={() => setCountryFilter(null)}
            className='mt-6 text-sm font-semibold text-accent hover:underline'
          >
            Show all photos
          </button>
        </div>
      ) : (
        <div className='space-y-12'>
          {featuredPhoto ? <PhotographyCard photo={featuredPhoto} priority size='large' /> : null}

          {gridPhotos.length > 0 ? (
            <div className='columns-1 gap-6 sm:columns-2 lg:columns-3 [column-gap:1.5rem]'>
              {gridPhotos.map((photo, index) => (
                <div key={photo._id} className='mb-6 break-inside-avoid'>
                  <PhotographyCard photo={photo} priority={!featuredPhoto && index < 2} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {activeCountry ? (
        <p className='text-center text-sm text-foreground-muted'>
          Showing {filteredPhotos.length} photo{filteredPhotos.length === 1 ? '' : 's'} from{' '}
          <Chip
            label={countryFilters.find(c => c.code === activeCountry)?.name ?? activeCountry}
            size='small'
            interactive={false}
            className='inline-flex align-middle'
          />
        </p>
      ) : null}
    </div>
  );
}
