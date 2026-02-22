import { createClient } from '@sanity/client';
import { createSanityImageBuilder, getAstroSanityConfig } from '@wisihe/sanity-core';

const sanityConfig = getAstroSanityConfig(import.meta.env);
const { projectId, dataset, apiVersion } = sanityConfig;

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

const imageBuilder = createSanityImageBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export default function imageUrl(source: string) {
  return imageBuilder.image(source);
}
