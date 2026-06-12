import type { TravelSelection } from './LifeJourneyMap';
import type { TravelPhotoItem } from './lifeJourneyTypes';

export function getPhotoPlaceId(photo: TravelPhotoItem): string | null {
  return photo.place?._id ?? null;
}

export function photoMatchesPlaceId(photo: TravelPhotoItem, placeId: string): boolean {
  return getPhotoPlaceId(photo) === placeId;
}

export function getPhotosForTravelSelection(
  photos: TravelPhotoItem[],
  selection: TravelSelection | null,
  countryContext?: { country?: string | null; countryCode?: string | null } | null,
): TravelPhotoItem[] {
  if (!selection) return [];

  if (selection.placeId) {
    const placePhotos = photos.filter(p => photoMatchesPlaceId(p, selection.placeId!));
    if (placePhotos.length > 0) return placePhotos;
  }

  if (selection.type === 'city' && countryContext) {
    return photos.filter(photo => matchesCountryContext(photo, countryContext));
  }

  if (selection.type === 'adventure' && selection.placeId) {
    return photos.filter(p => photoMatchesPlaceId(p, selection.placeId!));
  }

  return [];
}

export function matchesCountryContext(
  photo: TravelPhotoItem,
  context: { country?: string | null; countryCode?: string | null },
): boolean {
  const visitedCode = context.countryCode?.trim().toUpperCase();
  const photoCode =
    photo.place?.countryCode?.trim().toUpperCase() || photo.countryCode?.trim().toUpperCase();
  if (visitedCode && photoCode && visitedCode === photoCode) return true;

  const visitedName = context.country?.trim().toLowerCase();
  const photoCountry =
    photo.place?.countryName?.trim().toLowerCase() || photo.country?.trim().toLowerCase();
  if (visitedName && photoCountry && visitedName === photoCountry) return true;

  return false;
}
