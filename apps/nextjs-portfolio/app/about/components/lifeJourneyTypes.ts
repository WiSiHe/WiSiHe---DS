import type { AboutQueryResult } from '@wisihe/sanity-queries';
import { enrichJourneyItem } from './journeyCityDefaults';
import { enrichAdventurePlace, enrichVisitedCity } from './visitedCityDefaults';

type AboutDocument = NonNullable<AboutQueryResult>;
type RawJourneyItem = NonNullable<AboutDocument['journeyItems']>[number];

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface LifeJourneyItem {
  _key: string;
  year?: string | null;
  title?: string | null;
  content?: string | null;
  placeName?: string | null;
  locationType?: string | null;
  coordinates?: GeoCoordinates | null;
  mapZoom?: number | null;
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  image?: RawJourneyItem['image'];
}

export type LocationMeta = {
  label: string;
  markerClass: string;
  chipClass: string;
};

export const LOCATION_TYPE_META: Record<string, LocationMeta> = {
  birthplace: {
    label: 'Born',
    markerClass: 'bg-brand-2-500 ring-brand-2-300',
    chipClass: 'bg-brand-2-500/15 text-brand-2-400 border-brand-2-500/30',
  },
  lived: {
    label: 'Lived',
    markerClass: 'bg-brand-1-600 ring-brand-1-400',
    chipClass: 'bg-brand-1-600/15 text-brand-1-500 border-brand-1-600/30',
  },
  studied: {
    label: 'Studied',
    markerClass: 'bg-brand-3-600 ring-brand-3-400',
    chipClass: 'bg-brand-3-600/15 text-brand-3-500 border-brand-3-600/30',
  },
  worked: {
    label: 'Worked',
    markerClass: 'bg-accent ring-accent-border',
    chipClass: 'bg-accent/15 text-accent border-accent-border/40',
  },
  trip: {
    label: 'Adventure',
    markerClass: 'bg-neon-orange-500 ring-neon-orange-400',
    chipClass: 'bg-neon-orange-500/15 text-neon-orange-500 border-neon-orange-500/30',
  },
  other: {
    label: 'Place',
    markerClass: 'bg-foreground-muted ring-border',
    chipClass: 'bg-surface text-foreground-subtle border-border',
  },
  visited: {
    label: 'Visited',
    markerClass: 'bg-neon-yellow-500 ring-neon-yellow-400',
    chipClass: 'bg-neon-yellow-500/15 text-neon-yellow-500 border-neon-yellow-500/30',
  },
};

const FALLBACK_META: LocationMeta = {
  label: 'Place',
  markerClass: 'bg-foreground-muted ring-border',
  chipClass: 'bg-surface text-foreground-subtle border-border',
};

export function getLocationMeta(typeKey: string | null | undefined): LocationMeta {
  if (!typeKey) return FALLBACK_META;
  return LOCATION_TYPE_META[typeKey] ?? FALLBACK_META;
}

/** Unified map pin style for lived places — semantic accent, not per-type palette. */
export const LIVED_PLACE_PIN_META: LocationMeta = {
  label: 'Lived',
  markerClass: 'bg-accent ring-accent-border',
  chipClass: 'bg-accent/15 text-accent-text border-accent-border/40',
};

function parseCoordinates(value: unknown): GeoCoordinates | null {
  if (!value || typeof value !== 'object') return null;
  const { lat, lng } = value as { lat?: unknown; lng?: unknown };
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

export function normalizeJourneyItems(
  items: AboutDocument['journeyItems'] | null | undefined,
): LifeJourneyItem[] {
  return (items ?? []).map(item =>
    enrichJourneyItem({
      _key: item._key,
      year: item.year,
      title: item.title,
      content: item.content,
      placeName: (item as { placeName?: string | null }).placeName,
      locationType: (item as { locationType?: string | null }).locationType,
      coordinates: parseCoordinates((item as { coordinates?: unknown }).coordinates),
      mapZoom: (item as { mapZoom?: number | null }).mapZoom,
      funFact: (item as { funFact?: string | null }).funFact,
      stats: (item as { stats?: PlaceStat[] | null }).stats,
      image: item.image,
    }),
  );
}

export function hasMapCoordinates(item: LifeJourneyItem): boolean {
  return Boolean(item.coordinates);
}

export function getJourneyItemsWithCoordinates(
  items: LifeJourneyItem[] | null | undefined,
): LifeJourneyItem[] {
  return (items ?? []).filter(hasMapCoordinates);
}

export type PlaceStat = {
  label?: string | null;
  value?: string | null;
};

export type PlaceImage = {
  asset?: { _ref: string };
  lqip?: string | null;
  alt?: string;
} | null;

export type TravelPlaceSnapshot = {
  _id: string;
  name?: string | null;
  kind?: string | null;
  countryName?: string | null;
  countryCode?: string | null;
  coordinates?: GeoCoordinates | null;
  isHighlight?: boolean | null;
  funFact?: string | null;
  notes?: string | null;
  stats?: PlaceStat[] | null;
  image?: PlaceImage;
};

export interface VisitedCityItem {
  _key: string;
  placeId?: string | null;
  name?: string | null;
  coordinates?: GeoCoordinates | null;
  isHighlight?: boolean | null;
  country?: string | null;
  countryCode?: string | null;
  notes?: string | null;
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  image?: PlaceImage;
}

export interface AdventurePlaceItem {
  _key: string;
  placeId?: string | null;
  name?: string | null;
  placeName?: string | null;
  coordinates?: GeoCoordinates | null;
  notes?: string | null;
  funFact?: string | null;
  stats?: PlaceStat[] | null;
  image?: PlaceImage;
}

export interface VisitedCountryItem {
  _key: string;
  country?: string | null;
  countryCode?: string | null;
  placeName?: string | null;
  coordinates?: GeoCoordinates | null;
  notes?: string | null;
  cities?: VisitedCityItem[];
}

export interface TravelPhotoItem {
  _id: string;
  title?: string | null;
  country?: string | null;
  countryCode?: string | null;
  placeName?: string | null;
  place?: {
    _id: string;
    name?: string | null;
    countryName?: string | null;
    countryCode?: string | null;
  } | null;
  isFeatured?: boolean | null;
  capturedAt?: string | null;
  image?: {
    asset?: { _ref: string };
    lqip?: string | null;
    alt?: string;
  } | null;
}

/** Stable key for grouping photos with visited countries (ISO preferred). */
export function getTravelPhotoCountryKey(photo: TravelPhotoItem): string | null {
  const code = photo.countryCode?.trim().toUpperCase();
  if (code) return code;
  const name = photo.country?.trim();
  return name || null;
}

export function travelPhotoMatchesCountry(
  photo: TravelPhotoItem,
  visited: { country?: string | null; countryCode?: string | null },
): boolean {
  const photoKey = getTravelPhotoCountryKey(photo);
  if (!photoKey) return false;
  const visitedCode = visited.countryCode?.trim().toUpperCase();
  if (visitedCode && photoKey === visitedCode) return true;
  const visitedName = visited.country?.trim();
  if (visitedName && photoKey.toLowerCase() === visitedName.toLowerCase()) return true;
  if (visitedName && photo.country?.trim() === visitedName) return true;
  return false;
}

type RawVisitedCountry = NonNullable<AboutDocument['visitedCountries']>[number];
type RawVisitedCity = NonNullable<RawVisitedCountry['cities']>[number];
type RawAdventurePlace = NonNullable<AboutDocument['adventurePlaces']>[number];
type LinkedTravelPlace = NonNullable<RawVisitedCity['place']>;

function resolveVisitedCity(city: RawVisitedCity, country: RawVisitedCountry): VisitedCityItem {
  const place: LinkedTravelPlace | null = city.place;
  return enrichVisitedCity({
    _key: city._key,
    placeId: place?._id,
    name: place?.name ?? city.name,
    coordinates: parseCoordinates(place?.coordinates) ?? parseCoordinates(city.coordinates),
    isHighlight: place?.isHighlight ?? city.isHighlight,
    country: place?.countryName ?? country.country,
    countryCode: place?.countryCode ?? country.countryCode,
    notes: place?.notes ?? city.notes,
    funFact: place?.funFact ?? city.funFact,
    stats: place?.stats ?? city.stats,
    image: place?.image ?? city.image,
  });
}

function resolveAdventurePlace(place: RawAdventurePlace): AdventurePlaceItem {
  const linked: LinkedTravelPlace | null = place.place;
  return enrichAdventurePlace({
    _key: place._key,
    placeId: linked?._id,
    name: linked?.name ?? place.name,
    placeName: place.placeName,
    coordinates: parseCoordinates(linked?.coordinates) ?? parseCoordinates(place.coordinates),
    notes: linked?.notes ?? place.notes,
    funFact: linked?.funFact ?? place.funFact,
    stats: linked?.stats ?? place.stats,
    image: linked?.image ?? place.image,
  });
}

export function normalizeVisitedCountries(
  countries: AboutDocument['visitedCountries'] | null | undefined,
): VisitedCountryItem[] {
  return (countries ?? []).map(item => ({
    _key: item._key,
    country: item.country,
    countryCode: item.countryCode,
    placeName: item.placeName,
    notes: item.notes,
    coordinates: parseCoordinates(item.coordinates),
    cities: (item.cities ?? []).map(city => resolveVisitedCity(city, item)),
  }));
}

export function normalizeAdventurePlaces(
  places: AboutDocument['adventurePlaces'] | null | undefined,
): AdventurePlaceItem[] {
  return (places ?? []).map(place => resolveAdventurePlace(place));
}

export function flattenVisitedCities(countries: VisitedCountryItem[]): VisitedCityItem[] {
  return countries.flatMap(country =>
    (country.cities ?? []).filter(city => Boolean(city.coordinates)),
  );
}

export function normalizeTravelPhotos(
  photos: TravelPhotoItem[] | null | undefined,
): TravelPhotoItem[] {
  return (photos ?? []).filter(photo => Boolean(photo?._id && photo.image));
}

export function groupPhotosByCountry(photos: TravelPhotoItem[]): Map<string, TravelPhotoItem[]> {
  const grouped = new Map<string, TravelPhotoItem[]>();

  for (const photo of photos) {
    const key = getTravelPhotoCountryKey(photo);
    if (!key) continue;
    const list = grouped.get(key) ?? [];
    list.push(photo);
    grouped.set(key, list);
  }

  return grouped;
}

export function getVisitedCountriesWithCoordinates(
  countries: VisitedCountryItem[] | null | undefined,
): VisitedCountryItem[] {
  return (countries ?? []).filter(country => Boolean(country.coordinates));
}
