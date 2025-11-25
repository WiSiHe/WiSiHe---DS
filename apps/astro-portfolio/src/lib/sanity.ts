import { createClient } from '@sanity/client';
import builder from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_DATASET;

if (!projectId) {
  console.error('Sanity Project ID is missing. Please check your .env.local file.');
  console.error('Expected SANITY_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
});

export default function imageUrl(source: string) {
  return builder(client).image(source);
}
