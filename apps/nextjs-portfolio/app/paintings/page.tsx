import { sanityFetch } from '@/sanity/lib/live';
import { getAllPaintingsandTags } from '@/sanity/lib/queries';
import { Metadata } from 'next';

import { isEmptyObject } from '@wisihe/utils';
import { notFound } from 'next/navigation';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

import { GetAllPaintingsandTagsResult } from '@/sanity.types';
import Filters from '../components/Filters/Filters';
import PaintingGrid from '../components/PaintingGrid/PaintingGrid';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Paintings | WiSiHe',
  description: 'A gallery of some of my paintings',
  alternates: {
    canonical: 'https://www.wisihe.no/paintings', // Replace with your actual domain
  },
  openGraph: {
    title: 'Paintings | WiSiHe',
    description: 'A gallery of some of my paintings',
    url: 'https://www.wisihe.no/paintings', // Replace with your actual domain
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.example.com/images/hell.jpg', // Replace with a representative image
        width: 1200,
        height: 630,
        alt: 'A preview of various paintings from WiSiHe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paintings | WiSiHe',
    description: 'A gallery of some of my paintings',
    images: ['https://www.wisihe.no/images/hell.jpg'], // Same image as openGraph for consistency
  },
};

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
      <div className="p-4 pt-16 bg-dark">
        <div className="mx-auto prose prose-invert max-w-screen-2xl">
          <h1>Paintings</h1>
          <p>A gallery of some of my paintings</p>
          <Filters tags={sortedTags} />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <PaintingGrid paintings={paintings} />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </>
  );
}
