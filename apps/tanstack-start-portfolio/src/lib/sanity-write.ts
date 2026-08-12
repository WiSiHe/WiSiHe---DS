import { createClient } from '@sanity/client';
import { client as readClient } from './sanity';

function getWriteToken(): string | undefined {
  return import.meta.env.VITE_SANITY_WRITE_TOKEN?.trim();
}

export function getSanityWriteClient() {
  const token = getWriteToken();
  if (!token) return null;

  return createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
    useCdn: false,
    token,
  });
}

export { readClient as sanityReadClient };
