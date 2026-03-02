'use client';
import type { GetAllPaintingsandTagsResult } from '@wisihe/sanity-queries';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import useFilterSidebarStore from '@/store/useFilterModalStore';
import PaintingCard from '../PaintingCard/PaintingCard';

type PaintingGridProps = {
  paintings: GetAllPaintingsandTagsResult['paintings'];
};

const PaintingGrid = ({ paintings }: PaintingGridProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { selectedSort } = useFilterSidebarStore();

  const sort = searchParams.get('sort') || selectedSort;
  const filters = searchParams.getAll('filter').map(filter => filter.toLowerCase());

  // Memoize the filtered and sorted paintings
  const filteredPaintings = useMemo(() => {
    // Filtering logic
    const filtered = paintings.filter(painting => {
      if (filters.length === 0) return true;

      const paintingTagNames = painting.tagsV2?.map(tag => tag.name.toLowerCase()) || [];

      return filters.every(filter => paintingTagNames.includes(filter));
    });

    // Sorting logic
    if (sort) {
      if (sort === 'newest') {
        // Sort by newest (using 'paintedAt' field)
        filtered.sort((a, b) => new Date(b.paintedAt).getTime() - new Date(a.paintedAt).getTime());
      } else if (sort === 'oldest') {
        // Sort by oldest (using 'paintedAt' field)
        filtered.sort((a, b) => new Date(a.paintedAt).getTime() - new Date(b.paintedAt).getTime());
      } else if (sort === 'most-viewed') {
        // Sort by most viewed (using 'viewsCount' field)
        filtered.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      }
      //  else if (sort === 'random') {
      //   // Random sort
      //   filtered.sort(() => Math.random() - 0.5);
      // }
    }

    return filtered;
  }, [paintings, filters, sort]);

  // Function to clear filters
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('filter');
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  if (filteredPaintings.length === 0) {
    return (
      <div className='w-full py-4 mx-auto text-tertiary max-w-(--breakpoint-2xl)'>
        <p className='no-results-message'>
          No paintings match your filters.
          <br />
          <button type='button' onClick={clearFilters} className='clear-filters-button'>
            Clear Filters
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='w-full py-4 text-white'>
        <p className='no-results-message'>
          {filteredPaintings.length} paintings found.
          <br />
        </p>
      </div>
      <div className='grid w-full h-full grid-cols-12 gap-4'>
        {filteredPaintings.map(painting => (
          <div key={painting._id} className='relative col-span-6 sm:col-span-6 md:col-span-3'>
            <Suspense fallback={<div className='aspect-portrait'>Loading...</div>}>
              <PaintingCard paintingData={painting} />
            </Suspense>
          </div>
        ))}
      </div>
    </>
  );
};

export default PaintingGrid;
