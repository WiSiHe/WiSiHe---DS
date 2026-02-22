import { client } from './client';
import { generateStaticSlugs } from '@wisihe/sanity-queries';
export * from '@wisihe/sanity-queries';

export async function getStaticSlugs(type: string) {
  return client
    .withConfig({
      perspective: 'published',
      useCdn: true,
      stega: false,
    })
    .fetch(
      generateStaticSlugs,
      { type },
      {
        next: {
          tags: [type],
        },
      },
    );
}
