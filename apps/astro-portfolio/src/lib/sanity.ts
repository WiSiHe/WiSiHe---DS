import { createClient } from '@sanity/client';
import createImageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_DATASET;
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || import.meta.env.SANITY_API_VERSION || '2024-01-01';

if (!projectId) {
  console.error('Sanity Project ID is missing. Please check your .env.local file.');
  console.error('Expected SANITY_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export default function imageUrl(source: string) {
  return imageBuilder.image(source);
}
