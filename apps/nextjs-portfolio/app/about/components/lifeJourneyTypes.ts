import type { AboutQueryResult } from '@wisihe/sanity-queries';

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

function parseCoordinates(value: unknown): GeoCoordinates | null {
  if (!value || typeof value !== 'object') return null;
  const { lat, lng } = value as { lat?: unknown; lng?: unknown };
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

export function normalizeJourneyItems(
  items: AboutDocument['journeyItems'] | null | undefined,
): LifeJourneyItem[] {
  return (items ?? []).map(item => ({
    _key: item._key,
    year: item.year,
    title: item.title,
    content: item.content,
    placeName: (item as { placeName?: string | null }).placeName,
    locationType: (item as { locationType?: string | null }).locationType,
    coordinates: parseCoordinates((item as { coordinates?: unknown }).coordinates),
    mapZoom: (item as { mapZoom?: number | null }).mapZoom,
    image: item.image,
  }));
}

export function hasMapCoordinates(item: LifeJourneyItem): boolean {
  return Boolean(item.coordinates);
}

export function getJourneyItemsWithCoordinates(
  items: LifeJourneyItem[] | null | undefined,
): LifeJourneyItem[] {
  return (items ?? []).filter(hasMapCoordinates);
}
