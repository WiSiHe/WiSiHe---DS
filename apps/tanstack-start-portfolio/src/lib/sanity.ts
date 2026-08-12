import imageUrlBuilder from '@sanity/image-url';
import { createSanityClient, getSanityClientForRequest } from './sanity/client';

/** Published-content client (CDN). Prefer `getSanityClientForRequest` in server handlers. */
export const client = createSanityClient();

const builder = imageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export const urlForImage = urlFor;

export { createSanityClient, getSanityClientForRequest };
