'use client';

import { useMemo, useState } from 'react';
import { LifeJourneyMap, type TravelSelection } from './LifeJourneyMap';
import type { AdventurePlaceItem, TravelPhotoItem, VisitedCountryItem } from './lifeJourneyTypes';
import { MapPlaceDetailCard } from './MapPlaceDetailCard';
import { getPhotosForTravelSelection } from './travelPhotos';

type TravelOverviewSectionProps = {
  visitedCountries: VisitedCountryItem[];
  adventurePlaces?: AdventurePlaceItem[];
  travelPhotos?: TravelPhotoItem[];
  title?: string;
  description?: string;
};

export function TravelOverviewSection({
  visitedCountries,
  adventurePlaces = [],
  travelPhotos = [],
  title = "Countries I've visited",
  description = 'Explore the map — pick a city to see country context, notes, and stats beside the map.',
}: TravelOverviewSectionProps) {
  const [travelSelection, setTravelSelection] = useState<TravelSelection>(null);

  const selectedCity = useMemo(() => {
    if (travelSelection?.type !== 'city') return null;
    for (const country of visitedCountries) {
      const city = country.cities?.find(c => c._key === travelSelection.key);
      if (city) return { city, country };
    }
    return null;
  }, [travelSelection, visitedCountries]);

  const selectedAdventure = useMemo(() => {
    if (travelSelection?.type !== 'adventure') return null;
    return adventurePlaces.find(place => place._key === travelSelection.key) ?? null;
  }, [adventurePlaces, travelSelection]);

  if (visitedCountries.length === 0) return null;

  const selectionPhotos = getPhotosForTravelSelection(
    travelPhotos,
    travelSelection,
    selectedCity
      ? {
          country: selectedCity.country.country,
          countryCode: selectedCity.country.countryCode,
        }
      : null,
  );

  const detailProps = selectedCity
    ? {
        title: selectedCity.city.name,
        country: selectedCity.city.country ?? selectedCity.country.country,
        subtitle:
          selectedCity.city.stats?.find(s => s.label?.toLowerCase() === 'region')?.value ??
          selectedCity.city.stats?.find(s => s.label?.toLowerCase() === 'known for')?.value ??
          null,
        notes: selectedCity.city.notes,
        funFact: selectedCity.city.funFact,
        stats: selectedCity.city.stats,
        image: selectedCity.city.image,
      }
    : selectedAdventure
      ? {
          title: selectedAdventure.name,
          subtitle: selectedAdventure.placeName,
          notes: selectedAdventure.notes,
          funFact: selectedAdventure.funFact,
          stats: selectedAdventure.stats,
          image: selectedAdventure.image,
        }
      : null;

  return (
    <section
      id='travel-map-section'
      className='border-t border-border/40 bg-background'
      aria-label='Countries visited overview'
    >
      <div className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20'>
        <header className='mb-8 max-w-2xl space-y-4'>
          <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-neon-yellow-500'>
            Travel
          </p>
          <h2 className='font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
            {title}
          </h2>
          <p className='text-lg text-foreground-subtle text-pretty'>{description}</p>
        </header>

        <div className='grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-stretch'>
          <div className='h-[min(48svh,400px)] overflow-hidden rounded-2xl border border-border/50 shadow-xl sm:h-[min(52svh,460px)] lg:h-[min(62svh,600px)]'>
            <LifeJourneyMap
              items={[]}
              visitedCountries={visitedCountries}
              adventurePlaces={adventurePlaces}
              activeIndex={0}
              mapMode='travel'
              travelSelection={travelSelection}
              onTravelSelectionChange={setTravelSelection}
              className='h-full'
            />
          </div>

          <MapPlaceDetailCard
            {...(detailProps ?? {})}
            travelPhotos={detailProps ? selectionPhotos : []}
            onClear={detailProps ? () => setTravelSelection(null) : undefined}
            className='max-lg:mt-0 lg:min-h-[min(62svh,600px)]'
          />
        </div>
      </div>
    </section>
  );
}
