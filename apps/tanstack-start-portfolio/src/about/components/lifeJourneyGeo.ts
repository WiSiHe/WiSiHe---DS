import type {
  AdventurePlaceItem,
  GeoCoordinates,
  LifeJourneyItem,
  VisitedCountryItem,
} from './lifeJourneyTypes';
import { flattenVisitedCities } from './lifeJourneyTypes';

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

function quadraticBezierSegment(start: LngLat, end: LngLat, bend: number, steps = 28): LngLat[] {
  const midLng = (start[0] + end[0]) / 2;
  const midLat = (start[1] + end[1]) / 2;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy) || 1;
  const control: LngLat = [
    midLng - (dy / length) * bend * length,
    midLat + (dx / length) * bend * length,
  ];

  const coords: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inverse = 1 - t;
    coords.push([
      inverse * inverse * start[0] + 2 * inverse * t * control[0] + t * t * end[0],
      inverse * inverse * start[1] + 2 * inverse * t * control[1] + t * t * end[1],
    ]);
  }
  return coords;
}

function segmentBend(segmentIndex: number): number {
  const magnitude = 0.16 + (segmentIndex % 4) * 0.05;
  const direction = segmentIndex % 2 === 0 ? 1 : -1;
  return magnitude * direction;
}

/** Curved path between journey stops — swooping arcs like a travel montage. */
export function journeyCurvedRouteCoordinates(items: LifeJourneyItem[]): LngLat[] {
  const points = journeyRouteCoordinates(items);
  if (points.length < 2) return points;

  const curved: LngLat[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    if (!from || !to) continue;
    const segment = quadraticBezierSegment(from, to, segmentBend(i), 36);
    curved.push(...(i === 0 ? segment : segment.slice(1)));
  }
  return curved;
}

/** Cinematic camera bearing — subtle turn toward the next stop, not a full spin. */
export function journeyCameraBearing(
  from: GeoCoordinates | null | undefined,
  to: GeoCoordinates | null | undefined,
): number {
  if (!from || !to) return 0;
  const bearing = bearingBetween(from, to);
  const normalized = bearing > 180 ? bearing - 360 : bearing;
  return normalized * 0.42;
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

export function collectVisitedCountryPoints(visitedCountries: VisitedCountryItem[]): LngLat[] {
  const cityPoints = flattenVisitedCities(visitedCountries)
    .filter(city => city.coordinates)
    .map(city => toLngLat(city.coordinates as GeoCoordinates));

  if (cityPoints.length > 0) return cityPoints;

  return visitedCountries
    .filter(country => country.coordinates)
    .map(country => toLngLat(country.coordinates as GeoCoordinates));
}

export function collectTravelMapPoints(
  visitedCountries: VisitedCountryItem[],
  adventurePlaces: AdventurePlaceItem[] = [],
): LngLat[] {
  const points: LngLat[] = [];

  for (const city of flattenVisitedCities(visitedCountries)) {
    if (city.coordinates) points.push(toLngLat(city.coordinates));
  }

  for (const place of adventurePlaces) {
    if (place.coordinates) points.push(toLngLat(place.coordinates));
  }

  if (points.length > 0) return points;

  return collectVisitedCountryPoints(visitedCountries);
}

/** Regional zoom for scrolly — enough to anchor a place within its country. */
export function journeyScrollZoom(item: LifeJourneyItem): number {
  const cms = item.mapZoom ?? 5;
  return Math.min(Math.max(cms, 4), 5.5);
}
