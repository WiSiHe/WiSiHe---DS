'use client';

import { useSyncExternalStore } from 'react';
import { PAINTINGS_GALLERY_PATH, readPaintingsGalleryReturnUrl } from './paintingsGalleryReturnUrl';

function subscribe(_onStoreChange: () => void): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PAINTINGS_GALLERY_PATH;
}

/** Last `/paintings` URL the user had open this session (includes filters/page). */
export function usePaintingsGalleryReturnUrl(): string {
  return useSyncExternalStore(subscribe, readPaintingsGalleryReturnUrl, getServerSnapshot);
}
