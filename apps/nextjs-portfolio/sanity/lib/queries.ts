import { generateStaticSlugs } from '@wisihe/sanity-queries';
import { client } from './client';

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
