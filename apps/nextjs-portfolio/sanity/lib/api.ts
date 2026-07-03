/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
  sanityStudioUrl,
  sanityWriteToken,
} from '../../lib/env';

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

export const dataset = assertValue(
  sanityDataset(),
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
);

export const projectId = assertValue(
  sanityProjectId(),
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
);

export const apiVersion = sanityApiVersion();
export const studioUrl = sanityStudioUrl();
export const readToken = sanityReadToken();
export const writeToken = sanityWriteToken();
