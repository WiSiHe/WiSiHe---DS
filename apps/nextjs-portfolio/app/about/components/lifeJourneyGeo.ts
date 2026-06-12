import type { GeoCoordinates, LifeJourneyItem, VisitedCountryItem } from './lifeJourneyTypes';

type LngLat = [number, number];

export function toLngLat(point: GeoCoordinates): LngLat {
  return [point.lng, point.lat];
}

export function bearingBetween(from: GeoCoordinates, to: GeoCoordinates): number {
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function buildLineFeature(coordinates: LngLat[]) {
  if (coordinates.length < 2) return null;

  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates,
    },
  };
}

export function journeyRouteCoordinates(items: LifeJourneyItem[]): LngLat[] {
  return items
    .filter(item => item.coordinates)
    .map(item => toLngLat(item.coordinates as GeoCoordinates));
}

export function collectMapPoints(
  journeyItems: LifeJourneyItem[],
  visitedCountries: VisitedCountryItem[],
): LngLat[] {
  const points: LngLat[] = [];

  for (const item of journeyItems) {
    if (item.coordinates) points.push(toLngLat(item.coordinates));
  }
  for (const country of visitedCountries) {
    if (country.coordinates) points.push(toLngLat(country.coordinates));
  }

  return points;
}
