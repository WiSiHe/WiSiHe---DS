import type { GetPaginatedPaintingsResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sanityFetch } from '@/sanity/lib/live';
import {
  getAllPaintingsandTags,
  getFilteredPaginatedPaintings,
  getFilteredPaintingsCount,
  getPaginatedPaintings,
  getPaintingsCount,
} from '@/sanity/lib/queries';
import FilterManager from '../components/Filters/FilterManager';
import PaginatedPaintingGrid from '../components/PaginatedPaintingGrid/PaginatedPaintingGrid';
import ScrollToTopButton from '../components/ScrollToTop/ScrollToTop';

// Generate metadata dynamically to ensure canonical URLs point to base page
// This prevents duplicate indexing of paginated/filtered URLs
export async function generateMetadata(): Promise<Metadata> {
  // Always canonicalize to the base /paintings URL to prevent duplicate indexing
  // of paginated or filtered variations
  return {
    title: 'Digital Art Gallery',
    description:
      'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
    alternates: {
      canonical: 'https://www.wisihe.no/paintings',
    },
    openGraph: {
      title: 'Digital Art Gallery',
      description:
        'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
      url: 'https://www.wisihe.no/paintings',
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://www.wisihe.no/images/hell.jpg',
          width: 1200,
          height: 630,
          alt: "Digital art gallery showcasing WiSiHe's creative paintings and illustrations",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Digital Art Gallery',
      description:
        'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
      images: ['https://www.wisihe.no/images/hell.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      // Prevent indexing of paginated/filtered variations
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// Revalidation is handled automatically by defineLive + SanityLive
// export const revalidate = 86400;

export default async function Paintings({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  // Handle multiple filters: support both string and array
  let filters: string[] = [];
  if (params.filter) {
    if (Array.isArray(params.filter)) {
      filters = params.filter.filter(f => f.trim() !== '');
    } else {
      filters = params.filter
        .split(',')
        .map(f => f.trim())
        .filter(f => f !== '');
    }
  }
  // Limit to 5 filters for GROQ
  filters = filters.slice(0, 5);

  const limit = 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  // Fetch tags for the filter manager
  const tagsResult = await sanityFetch({
    query: getAllPaintingsandTags,
  });

  // Use filtered queries if filters are provided, otherwise use regular queries
  const paintingsQuery = filters.length > 0 ? getFilteredPaginatedPaintings : getPaginatedPaintings;
  const countQuery = filters.length > 0 ? getFilteredPaintingsCount : getPaintingsCount;

  let result;
  let countResult;

  if (filters.length > 0) {
    // Build filter params for GROQ
    const filterParams: Record<string, string> = {};
    for (let i = 0; i < 5; i++) {
      filterParams[`filter${i}`] = filters[i] || '';
    }
    [result, countResult] = await Promise.all([
      sanityFetch({
        query: paintingsQuery,
        params: { start, end, ...filterParams },
      }),
      sanityFetch({
        query: countQuery,
        params: { ...filterParams },
      }),
    ]);
  } else {
    [result, countResult] = await Promise.all([
      sanityFetch({
        query: paintingsQuery,
        params: { start, end },
      }),
      sanityFetch({
        query: countQuery,
      }),
    ]);
  }

  const paintings = result.data as GetPaginatedPaintingsResult;
  const tags = tagsResult.data?.tags || [];

  // For filtered results, use the filtered count query result
  const totalCount = countResult.data;

  const totalPages = Math.ceil(totalCount / limit);

  const initialPagination = {
    page,
    limit,
    totalCount: totalCount,
    hasMore: page < totalPages,
    totalPages,
  };

  return (
    <>
      <div className='flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-7xl'>
        <div className='w-full p-4'>
          <div className='pb-4'>
            <h1 className='font-semibold text-foreground text-3xl md:text-4xl mb-3'>
              Digital Art Gallery
            </h1>
            <p className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed'>
              A curated collection of my digital paintings and artwork, exploring themes of
              imagination, storytelling, and visual creativity. Each piece represents a moment of
              artistic expression and digital craftsmanship.
            </p>
            {filters.length > 0 && (
              <div className='mt-4'>
                <p className='text-sm text-foreground-subtle'>
                  Filtering by:{' '}
                  <span className='font-medium text-foreground'>{filters.join(', ')}</span>
                </p>
                <p className='text-xs text-foreground-muted mt-1'>
                  Found {totalCount} painting{totalCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Filter Manager */}
          <FilterManager tags={tags} currentFilters={filters} />

          <Suspense fallback={<div className='text-foreground-subtle'>Loading...</div>}>
            <PaginatedPaintingGrid
              initialPaintings={paintings}
              initialPagination={initialPagination}
              initialFilter={filters.join(',')}
            />
          </Suspense>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
