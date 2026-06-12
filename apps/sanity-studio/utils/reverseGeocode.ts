export type ReverseGeocodeResult = {
  /** One-line label for editors, e.g. "Narbonne, Occitanie, France". */
  label: string;
  placeName?: string;
  region?: string;
  country?: string;
};

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const USER_AGENT = 'WiSiHe-Sanity-Studio/1.0 (portfolio travel map)';

function pickPlaceName(address: NominatimAddress | undefined): string | undefined {
  if (!address) return undefined;
  return (
    address.city?.trim() ||
    address.town?.trim() ||
    address.village?.trim() ||
    address.municipality?.trim() ||
    undefined
  );
}

function pickRegion(address: NominatimAddress | undefined): string | undefined {
  if (!address) return undefined;
  return address.state?.trim() || address.county?.trim() || undefined;
}

function buildLabel(
  placeName: string | undefined,
  region: string | undefined,
  country: string | undefined,
  fallback?: string,
): string {
  const parts = [placeName, region, country].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return fallback ?? 'Unknown location';
}

/** Resolve GPS coordinates to a human place label (OpenStreetMap Nominatim). */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('zoom', '10');

  const response = await fetch(url.toString(), {
    headers: { 'Accept-Language': 'en', 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Location lookup failed (${response.status})`);
  }

  const data = (await response.json()) as NominatimResponse;
  const address = data.address;
  const placeName = pickPlaceName(address);
  const region = pickRegion(address);
  const country = address?.country?.trim();

  return {
    label: buildLabel(placeName, region, country, data.display_name),
    placeName,
    region,
    country,
  };
}
