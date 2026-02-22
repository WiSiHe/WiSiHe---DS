/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

import { getNextSanityConfig } from '@wisihe/sanity-core';

const sanityConfig = getNextSanityConfig(
  process.env as Record<string, string | undefined>,
);

export const { dataset, projectId, apiVersion, studioUrl, readToken, writeToken } =
  sanityConfig;
