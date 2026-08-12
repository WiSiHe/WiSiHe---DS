import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import {
  getPhotographyAspectRatio,
  urlForPhotographyCard,
} from '@/lib/photography/photographyImage';
import {
  type PhotographyMapPoint,
  resolvePhotographyMapPoint,
} from '@/lib/photography/photographyMapPoint';

export type { PhotographyMapPoint };

export type PhotographyMapMarker = {
  photoId: string;
  slug: string;
  title: string;
  placeLabel: string | null;
  thumbnailUrl: string | null;
  point: PhotographyMapPoint;
};

function formatPlaceLabel(place: PhotographyListQueryResult[number]['place']): string | null {
  if (!place) return null;
  if (place.name && place.countryName) return `${place.name} · ${place.countryName}`;
  if (place.name) return place.name;
  if (place.countryName) return place.countryName;
  return null;
}

export function buildPhotographyMapMarkers(
  photos: PhotographyListQueryResult,
): PhotographyMapMarker[] {
  const markers: PhotographyMapMarker[] = [];

  for (const photo of photos) {
    if (!photo.slug) continue;

    const point = resolvePhotographyMapPoint({
      imageLocation: photo.image?.location,
      placeName: photo.place?.name,
      placeCountry: photo.place?.countryName,
      placeCoordinates: photo.place?.coordinates,
    });
    if (!point) continue;

    const aspectRatio = getPhotographyAspectRatio(photo.image);
    markers.push({
      photoId: photo._id,
      slug: photo.slug,
      title: photo.title,
      placeLabel: formatPlaceLabel(photo.place),
      thumbnailUrl: urlForPhotographyCard(photo.image, aspectRatio),
      point,
    });
  }

  return markers;
}
