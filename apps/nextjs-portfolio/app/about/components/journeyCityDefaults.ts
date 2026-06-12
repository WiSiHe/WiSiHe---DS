import type { LifeJourneyItem, PlaceStat } from './lifeJourneyTypes';

type JourneyFactDefaults = {
  funFact: string;
  stats: PlaceStat[];
};

/** Fallback city facts when Sanity fields are empty (dev / stale cache). */
export const JOURNEY_CITY_DEFAULTS: Record<string, JourneyFactDefaults> = {
  'journey-hammerfest': {
    funFact:
      'North of the Arctic Circle — among the northernmost towns on Earth, with midnight sun in summer.',
    stats: [
      { label: 'Population', value: '~11,000' },
      { label: 'Region', value: 'Finnmark' },
      { label: 'Latitude', value: '70.66° N' },
    ],
  },
  'journey-haslemoen': {
    funFact:
      'Innlandet military country — forests, river valleys, and wide skies in eastern Norway.',
    stats: [
      { label: 'Region', value: 'Innlandet' },
      { label: 'Near', value: 'Eidsvoll' },
      { label: 'Landscape', value: 'Forest & rivers' },
    ],
  },
  'journey-setermoen': {
    funFact:
      'Village in Troms near Bardufoss — mountains on every horizon and short hops to Arctic wilderness.',
    stats: [
      { label: 'Region', value: 'Troms' },
      { label: 'Near', value: 'Bardufoss' },
      { label: 'Landscape', value: 'Mountains' },
    ],
  },
  'journey-baerum': {
    funFact:
      'Affluent municipality west of Oslo — fjord shoreline on one side, forested hills on the other.',
    stats: [
      { label: 'Population', value: '~130,000' },
      { label: 'Region', value: 'Akershus' },
      { label: 'From Oslo', value: '~15 min west' },
    ],
  },
  'journey-arendal': {
    funFact:
      'Southern coastal town with a lively harbour, wooden houses, and skerries along the Skagerrak.',
    stats: [
      { label: 'Population', value: '~45,000' },
      { label: 'Region', value: 'Agder' },
      { label: 'Coast', value: 'Southern Norway' },
    ],
  },
  'journey-tromso': {
    funFact:
      'The Arctic capital — northern lights, midnight sun, and the world’s northernmost university city.',
    stats: [
      { label: 'Population', value: '~80,000' },
      { label: 'Latitude', value: '69.65° N' },
      { label: 'Nickname', value: 'Paris of the North' },
    ],
  },
  'journey-bergen': {
    funFact:
      'Gateway to the fjords — UNESCO Bryggen wharf, seven mountains, and famously rainy weather.',
    stats: [
      { label: 'Population', value: '~290,000' },
      { label: 'Region', value: 'Vestland' },
      { label: 'Rain days', value: '~240 / year' },
    ],
  },
  'journey-oslo': {
    funFact:
      "Norway's capital on the Oslofjord — Viking-age roots and forests you can reach by metro.",
    stats: [
      { label: 'Population', value: '~700,000' },
      { label: 'Founded', value: '~1000 AD' },
      { label: 'Known for', value: 'Green capital' },
    ],
  },
};

export function enrichJourneyItem(item: LifeJourneyItem): LifeJourneyItem {
  const defaults = JOURNEY_CITY_DEFAULTS[item._key];
  if (!defaults) return item;

  const stats = item.stats?.length ? item.stats : defaults.stats;

  return {
    ...item,
    funFact: item.funFact?.trim() || defaults.funFact,
    stats,
  };
}
