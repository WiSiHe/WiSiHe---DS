/** Mapbox access token — set `VITE_MAPBOX_TOKEN` in `.env` (see `.env.example`). */
export function getMapboxToken(): string | undefined {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  return typeof token === 'string' && token.trim() ? token.trim() : undefined;
}

export function hasMapboxToken(): boolean {
  return Boolean(getMapboxToken());
}
