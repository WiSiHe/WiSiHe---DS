import { sanityFetch } from '@/sanity/lib/live';
import { getPaginatedPaintings, getPaintingsCount } from '@/sanity/lib/queries';
import { Metadata } from 'next';

import { notFound } from 'next/navigation';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

import PaginatedPaintingGrid from '../components/PaginatedPaintingGrid/PaginatedPaintingGrid';

import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Digital Art Gallery | WiSiHe',
  description:
    'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
  alternates: {
    canonical: 'https://www.wisihe.no/paintings', // Replace with your actual domain
  },
  openGraph: {
    title: 'Digital Art Gallery | WiSiHe',
    description:
      'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
    url: 'https://www.wisihe.no/paintings', // Replace with your actual domain
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.example.com/images/hell.jpg', // Replace with a representative image
        width: 1200,
        height: 630,
        alt: "Digital art gallery showcasing WiSiHe's creative paintings and illustrations",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Art Gallery | WiSiHe',
    description:
      'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
    images: ['https://www.wisihe.no/images/hell.jpg'], // Same image as openGraph for consistency
  },
};

export const revalidate = 86400;

export default async function Paintings({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  const result = await sanityFetch({
    query: getPaginatedPaintings,
    params: { start, end },
  });

  const paintings = result.data;

  if (!paintings || paintings.length === 0) {
    return notFound();
  }

  // Get total count for pagination info
  const countResult = await sanityFetch({
    query: getPaintingsCount,
  });

  const totalCount = countResult.data;
  const totalPages = Math.ceil(totalCount / limit);

  const initialPagination = {
    page,
    limit,
    totalCount,
    hasMore: page < totalPages,
    totalPages,
  };

  return (
    <>
      <div className="flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-(--breakpoint-2xl)">
        <div className="w-full p-4">
          <div className="pb-4">
            <h1 className="font-semibold">Digital Art Gallery</h1>
            <p className="text-muted-foreground">
              A curated collection of my digital paintings and artwork, exploring themes of
              imagination, storytelling, and visual creativity. Each piece represents a moment of
              artistic expression and digital craftsmanship.
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <PaginatedPaintingGrid
              initialPaintings={paintings}
              initialPagination={initialPagination}
            />
          </Suspense>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
