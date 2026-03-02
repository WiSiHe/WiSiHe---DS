import createImageUrlBuilder from '@sanity/image-url';

const builder = createImageUrlBuilder({
  // eslint-disable-next-line no-undef
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  // eslint-disable-next-line no-undef
  dataset: process.env.SANITY_STUDIO_DATASET || '',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: Any is used for Sanity image source
export function urlFor(source: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return builder.image(source);
}
