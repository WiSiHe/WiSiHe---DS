import { sanityFetch } from '@/sanity/lib/live';
import { getAllPaintingsandTags } from '@/sanity/lib/queries';
import { Metadata } from 'next';

import { isEmptyObject } from '@wisihe/utils';
import { notFound } from 'next/navigation';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

export const metadata: Metadata = {
  title: 'Paintings | WiSiHe',
  description: 'A gallery of some of my paintings',
};

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import Filters from '../components/Filters/Filters';
import PaintingGrid from '../components/PaintingGrid/PaintingGrid';
import { Suspense } from 'react';

export default async function Paintings() {
  const [{ data }]: [{ data: GetAllPaintingsandTagsResult }] =
    await Promise.all([sanityFetch({ query: getAllPaintingsandTags })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { paintings, tags } = data;

  const sortedTags = tags
    .filter((tag: { paintingsCount: number }) => tag.paintingsCount > 2)
    .sort((a, b) => {
      if (a.name === 'Store') return -1;
      if (b.name === 'Store') return 1;
      return (
        b.paintingsCount - a.paintingsCount || a.name.localeCompare(b.name)
      );
    });

  return (
    <>
      <div className="p-4 mt-16 bg-dark">
        <div className="prose prose-invert">
          <h1>Paintings</h1>
          <p>A gallery of some of my paintings</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Filters tags={sortedTags} />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <PaintingGrid paintings={paintings} />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </>
  );
}
