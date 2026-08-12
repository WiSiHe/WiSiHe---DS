import { createFileRoute } from '@tanstack/react-router';
import PaintingCard from '@/components/paintings/PaintingCard';
import { PaintingsGalleryReturnUrlSync } from '@/components/paintings/PaintingsGalleryReturnUrlSync';
import PaintingsSearch from '@/components/paintings/PaintingsSearch/PaintingsSearch';
import { fetchPaintingsSearch } from '@/lib/algolia/paintingsSearch/fetchPaintingsSearch';
import { parsePaintingsSearchParams } from '@/lib/algolia/paintingsSearch/parsePaintingsSearchParams';
import { paintingsSearchSchema } from '@/lib/algolia/paintingsSearch/searchParamsSchema';
import type { PaintingsSearchResults } from '@/lib/algolia/paintingsSearch/types';
import { isAlgoliaConfigured } from '@/lib/algolia/searchClient';
import { buildHead } from '@/lib/seo';
import { getPaintings, type PaintingListItem } from '@/server/fns';

type PaintingsLoaderData = {
  paintings: PaintingListItem[];
  initialResults: PaintingsSearchResults | null;
  algoliaConfigured: boolean;
};

export const Route = createFileRoute('/paintings/')({
  validateSearch: search => paintingsSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const parsedSearch = parsePaintingsSearchParams(deps);
    const [paintings, initialResults] = await Promise.all([
      getPaintings(),
      isAlgoliaConfigured ? fetchPaintingsSearch(parsedSearch) : Promise.resolve(null),
    ]);

    return {
      paintings,
      initialResults,
      algoliaConfigured: isAlgoliaConfigured,
    };
  },
  head: () =>
    buildHead({
      title: 'Paintings | WiSiHe',
      description: 'A curated collection of digital paintings and artwork by Henrik Sissener.',
      path: '/paintings',
    }),
  component: PaintingsPage,
});

function SanityPaintingsGrid({ paintings }: { paintings: PaintingListItem[] }) {
  return (
    <div className='mt-4 columns-2 gap-3 sm:columns-2 md:columns-3'>
      {paintings.map(painting =>
        painting.slug ? (
          <div key={painting._id} className='mb-3 break-inside-avoid'>
            <PaintingCard paintingData={painting} />
          </div>
        ) : null,
      )}
    </div>
  );
}

function PaintingsPage() {
  const { paintings, initialResults, algoliaConfigured } =
    Route.useLoaderData() as PaintingsLoaderData;

  return (
    <div className='w-full min-h-screen pt-32 pb-20 mx-auto max-w-7xl px-4'>
      <PaintingsGalleryReturnUrlSync />
      <div className='pb-5 flex items-baseline gap-3'>
        <h1 className='font-semibold text-foreground text-2xl md:text-3xl'>Digital Art Gallery</h1>
      </div>

      {algoliaConfigured ? (
        <PaintingsSearch initialResults={initialResults as PaintingsSearchResults | null} />
      ) : (
        <SanityPaintingsGrid paintings={paintings} />
      )}
    </div>
  );
}
