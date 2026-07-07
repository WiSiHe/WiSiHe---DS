export type PhotographyView = 'gallery' | 'map';

export function parsePhotographyView(raw: string | null | undefined): PhotographyView {
  return raw?.trim().toLowerCase() === 'map' ? 'map' : 'gallery';
}

export function buildPhotographyHref(options: {
  view?: PhotographyView | null;
  country?: string | null;
}): string {
  const params = new URLSearchParams();
  if (options.view === 'map') params.set('view', 'map');
  const country = options.country?.trim().toUpperCase();
  if (country) params.set('country', country);
  const query = params.toString();
  return query ? `/photography?${query}` : '/photography';
}
