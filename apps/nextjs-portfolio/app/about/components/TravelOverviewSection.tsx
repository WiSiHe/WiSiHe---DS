'use client';

import { cn } from '@wisihe/utils';
import { CountryPhotoStrip } from './CountryPhotoStrip';
import { LifeJourneyMap } from './LifeJourneyMap';
import {
  getLocationMeta,
  groupPhotosByCountry,
  type TravelPhotoItem,
  type VisitedCountryItem,
} from './lifeJourneyTypes';

type TravelOverviewSectionProps = {
  visitedCountries: VisitedCountryItem[];
  travelPhotos?: TravelPhotoItem[];
};

export function TravelOverviewSection({
  visitedCountries,
  travelPhotos = [],
}: TravelOverviewSectionProps) {
  if (visitedCountries.length === 0) return null;

  const photosByCountry = groupPhotosByCountry(travelPhotos);
  const visitedMeta = getLocationMeta('visited');

  return (
    <section
      className='border-t border-border/40 bg-background'
      aria-label='Countries visited overview'
    >
      <div className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20'>
        <header className='mb-10 max-w-2xl space-y-4 lg:mb-12'>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-neon-yellow-500'>
            Travel
          </p>
          <h2 className='font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Countries I&apos;ve visited
          </h2>
          <p className='text-lg text-foreground-subtle text-pretty'>
            Everywhere explored so far — all highlighted at once. Tag photography with a matching
            country name to show photos in each card.
          </p>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-10 xl:gap-14'>
          {/* Map — 40%, sticky */}
          <div className='order-1'>
            <div className='sticky top-0 z-10 -mx-4 h-[36svh] overflow-hidden border-b border-border/40 bg-background sm:-mx-6 sm:h-[40svh] lg:top-8 lg:mx-0 lg:h-[min(72svh,640px)] lg:rounded-2xl lg:border lg:border-border/50 lg:shadow-xl'>
              <LifeJourneyMap
                items={[]}
                visitedCountries={visitedCountries}
                activeIndex={0}
                mapMode='travel'
                className='h-full'
              />
            </div>
          </div>

          {/* Country cards — 60% */}
          <ul className='order-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
            {visitedCountries.map(country => {
              const countryPhotos = country.country
                ? (photosByCountry.get(country.country) ?? [])
                : [];

              return (
                <li
                  key={country._key}
                  className='rounded-2xl border border-border/50 bg-surface/40 p-5'
                >
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      visitedMeta.chipClass,
                    )}
                  >
                    Visited
                  </span>
                  <h3 className='mt-3 font-serif text-xl font-bold text-foreground'>
                    {country.country}
                  </h3>
                  {country.placeName ? (
                    <p className='mt-1 text-sm text-foreground-muted'>{country.placeName}</p>
                  ) : null}
                  {country.notes ? (
                    <p className='mt-2 text-sm text-foreground-subtle text-pretty'>
                      {country.notes}
                    </p>
                  ) : null}
                  {country.country ? (
                    <CountryPhotoStrip photos={countryPhotos} country={country.country} />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
