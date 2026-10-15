import imageUrlBuilder from '@sanity/image-url';
import { createSanityClient, getSanityClientForRequest } from './sanity/client';

/** Published-content client (CDN). Prefer `getSanityClientForRequest` in server handlers. */
export const client = createSanityClient();

const builder = imageUrlBuilder(client);

/** `auto('format')` lets the Sanity CDN serve AVIF/WebP instead of the source PNG/JPEG. */
export function urlForImage(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto('format');
}

export { createSanityClient, getSanityClientForRequest };
