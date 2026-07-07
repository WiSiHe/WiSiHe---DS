export type PhotographyMapPoint = {
  latitude: number;
  longitude: number;
  precision: 'exact' | 'place';
  label?: string;
};

export function resolvePhotographyMapPoint(input: {
  imageLocation?: { lat?: number; lng?: number } | null;
  placeName?: string | null;
  placeCountry?: string | null;
  placeCoordinates?: { lat?: number; lng?: number } | null;
}): PhotographyMapPoint | null {
  const img = input.imageLocation;
  if (typeof img?.lat === 'number' && typeof img?.lng === 'number') {
    const label = [input.placeName, input.placeCountry].filter(Boolean).join(', ');
    return {
      latitude: img.lat,
      longitude: img.lng,
      precision: 'exact',
      label: label || undefined,
    };
  }

  const place = input.placeCoordinates;
  if (typeof place?.lat === 'number' && typeof place?.lng === 'number') {
    const label = [input.placeName, input.placeCountry].filter(Boolean).join(', ');
    return {
      latitude: place.lat,
      longitude: place.lng,
      precision: 'place',
      label: label || undefined,
    };
  }

  return null;
}
