export const PHOTOGRAPHY_GALLERY_PATH = '/photography';
export const PHOTOGRAPHY_GALLERY_RETURN_KEY = 'photography-gallery-return-url';

export function isPhotographyGalleryPath(path: string): boolean {
  return path === PHOTOGRAPHY_GALLERY_PATH || path.startsWith(`${PHOTOGRAPHY_GALLERY_PATH}?`);
}

export function writePhotographyGalleryReturnUrl(url: string): void {
  if (typeof window === 'undefined' || !isPhotographyGalleryPath(url)) return;

  try {
    sessionStorage.setItem(PHOTOGRAPHY_GALLERY_RETURN_KEY, url);
  } catch {
    // Private browsing or storage disabled
  }
}

export function readPhotographyGalleryReturnUrl(): string {
  if (typeof window === 'undefined') return PHOTOGRAPHY_GALLERY_PATH;

  try {
    const stored = sessionStorage.getItem(PHOTOGRAPHY_GALLERY_RETURN_KEY);
    if (stored && isPhotographyGalleryPath(stored)) return stored;
  } catch {
    // ignore
  }

  return PHOTOGRAPHY_GALLERY_PATH;
}
