import { createImageUrlBuilder } from '@sanity/image-url';
import { studioDataset, studioProjectId } from '../lib/env';

const builder = createImageUrlBuilder({
  projectId: studioProjectId() || '',
  dataset: studioDataset(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: Any is used for Sanity image source
export function urlFor(source: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return builder.image(source);
}
