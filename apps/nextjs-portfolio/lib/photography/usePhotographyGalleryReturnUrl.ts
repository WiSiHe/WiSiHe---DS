'use client';

import { useSyncExternalStore } from 'react';
import {
  PHOTOGRAPHY_GALLERY_PATH,
  readPhotographyGalleryReturnUrl,
} from './photographyGalleryReturnUrl';

function subscribe(_onStoreChange: () => void): () => void {
  return () => {};
}

function getServerSnapshot(): string {
  return PHOTOGRAPHY_GALLERY_PATH;
}

/** Last `/photography` URL the user had open this session (includes view/country filters). */
export function usePhotographyGalleryReturnUrl(): string {
  return useSyncExternalStore(subscribe, readPhotographyGalleryReturnUrl, getServerSnapshot);
}
