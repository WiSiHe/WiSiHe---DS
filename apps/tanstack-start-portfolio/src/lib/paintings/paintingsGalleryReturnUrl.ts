export const PAINTINGS_GALLERY_PATH = '/paintings';
export const PAINTINGS_GALLERY_RETURN_KEY = 'paintings-gallery-return-url';

export function isPaintingsGalleryPath(path: string): boolean {
  return path === PAINTINGS_GALLERY_PATH || path.startsWith(`${PAINTINGS_GALLERY_PATH}?`);
}

export function writePaintingsGalleryReturnUrl(url: string): void {
  if (typeof window === 'undefined' || !isPaintingsGalleryPath(url)) return;

  try {
    sessionStorage.setItem(PAINTINGS_GALLERY_RETURN_KEY, url);
  } catch {
    // Private browsing or storage disabled
  }
}

export function readPaintingsGalleryReturnUrl(): string {
  if (typeof window === 'undefined') return PAINTINGS_GALLERY_PATH;

  try {
    const stored = sessionStorage.getItem(PAINTINGS_GALLERY_RETURN_KEY);
    if (stored && isPaintingsGalleryPath(stored)) return stored;
  } catch {
    // ignore
  }

  return PAINTINGS_GALLERY_PATH;
}

export function paintingsTagSearchHref(tag: string): string {
  const params = new URLSearchParams();
  params.set('tag', tag);
  return `${PAINTINGS_GALLERY_PATH}?${params.toString()}`;
}
