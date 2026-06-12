import factsData from '../data/visited-city-facts.json';
import type { AdventurePlaceItem, PlaceStat, VisitedCityItem } from './lifeJourneyTypes';

type FactEntry = {
  funFact: string;
  stats: PlaceStat[];
};

const CITY_FACTS = factsData.cities as Record<string, FactEntry>;
const ADVENTURE_FACTS = factsData.adventures as Record<string, FactEntry>;

function applyFactDefaults<
  T extends { _key: string; funFact?: string | null; stats?: PlaceStat[] | null },
>(item: T, defaults: Record<string, FactEntry>): T {
  const entry = defaults[item._key];
  if (!entry) return item;

  return {
    ...item,
    funFact: item.funFact?.trim() || entry.funFact,
    stats: item.stats?.length ? item.stats : entry.stats,
  };
}

export function enrichVisitedCity(city: VisitedCityItem): VisitedCityItem {
  return applyFactDefaults(city, CITY_FACTS);
}

export function enrichAdventurePlace(place: AdventurePlaceItem): AdventurePlaceItem {
  return applyFactDefaults(place, ADVENTURE_FACTS);
}
