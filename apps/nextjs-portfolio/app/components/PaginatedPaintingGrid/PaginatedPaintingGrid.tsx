'use client';
import type { GetPaginatedPaintingsResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStepBackward, FaStepForward } from 'react-icons/fa';
import PaintingCard from '../PaintingCard/PaintingCard';

type ApiResponse = {
  paintings: GetPaginatedPaintingsResult;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
};

type Painting = GetPaginatedPaintingsResult[0];

type PaginationInfo = {
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
  totalPages: number;
};

type PaginatedPaintingGridProps = {
  initialPaintings: Painting[];
  initialPagination: PaginationInfo;
  initialFilter?: string;
};

const PaginatedPaintingGrid = ({
  initialPaintings,
  initialPagination,
  initialFilter = '',
}: PaginatedPaintingGridProps) => {
  const searchParams = useSearchParams();
  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
  const [currentFilter, setCurrentFilter] = useState<string>(initialFilter);

  const loadPage = useCallback(
    async (pageNumber: number, filter: string = currentFilter) => {
      if (pageNumber < 1) return;

      try {
        const url = new URL('/api/paintings', window.location.origin);
        url.searchParams.set('page', pageNumber.toString());
        url.searchParams.set('limit', '12');
        if (filter) {
          url.searchParams.set('filter', filter);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error('Failed to fetch paintings');
        }

        const data = (await response.json()) as ApiResponse;

        if (data.paintings) {
          setPaintings(data.paintings);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error loading paintings:', error);
      }
    },
    [currentFilter],
  );

  // Handle URL-based pagination and filtering
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const filterParam = searchParams.get('filter') || '';
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;

    // Check if filter changed
    if (filterParam !== currentFilter) {
      setCurrentFilter(filterParam);
      // Reset to page 1 when filter changes
      void loadPage(1, filterParam);
      return;
    }

    if (pageNumber !== pagination.page && pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      void loadPage(pageNumber, filterParam);
    }
  }, [searchParams, currentFilter, loadPage, pagination.page, pagination.totalPages]);

  // Helper function to build pagination URL
  const buildPageUrl = (pageNumber: number): string => {
    const params = new URLSearchParams();
    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    }
    if (currentFilter) {
      params.set('filter', currentFilter);
    }
    const queryString = params.toString();
    if (queryString) {
      return `/paintings?${queryString}`;
    }
    return '/paintings';
  };

  return (
    <>
      <div className='grid w-full h-full grid-cols-12 gap-2'>
        {paintings.map((painting, index) => (
          <div
            key={painting._id}
            className='relative col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3'
          >
            <PaintingCard
              paintingData={painting}
              shouldBeLazy={index < 4} // Prioritize first 4 paintings (visible on most screen sizes)
            />
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className='flex justify-center w-full items-center mt-8 mb-4'>
          <div className='flex items-center space-x-2'>
            {/* First Page Link */}
            {pagination.page > 1 ? (
              <Link
                href={buildPageUrl(1)}
                className='px-4 py-2 rounded flex items-center gap-2 bg-accent text-accent-contrast hover:bg-accent-hover transition-colors'
                aria-label='First page'
              >
                <FaStepBackward />
              </Link>
            ) : (
              <span
                className='px-4 py-2 rounded flex items-center gap-2 bg-surface-hover/50 text-foreground-muted cursor-not-allowed'
                aria-label='First page'
              >
                <FaStepBackward />
              </span>
            )}

            {/* Previous Page Link */}
            {pagination.page > 1 ? (
              <Link
                href={buildPageUrl(pagination.page - 1)}
                className='px-4 py-2 rounded flex items-center gap-2 bg-accent text-accent-contrast hover:bg-accent-hover transition-colors'
                aria-label='Previous page'
              >
                <FaArrowLeft />
              </Link>
            ) : (
              <span
                className='px-4 py-2 rounded flex items-center gap-2 bg-surface-hover/50 text-foreground-muted cursor-not-allowed'
                aria-label='Previous page'
              >
                <FaArrowLeft />
              </span>
            )}

            <span className='px-4 py-2 text-sm text-foreground'>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            {/* Next Page Link */}
            {pagination.page < pagination.totalPages ? (
              <Link
                href={buildPageUrl(pagination.page + 1)}
                className='px-4 py-2 rounded flex items-center gap-2 bg-accent text-accent-contrast hover:bg-accent-hover transition-colors'
                aria-label='Next page'
              >
                <FaArrowRight />
              </Link>
            ) : (
              <span
                className='px-4 py-2 rounded flex items-center gap-2 bg-surface-hover/50 text-foreground-muted cursor-not-allowed'
                aria-label='Next page'
              >
                <FaArrowRight />
              </span>
            )}

            {/* Last Page Link */}
            {pagination.page < pagination.totalPages ? (
              <Link
                href={buildPageUrl(pagination.totalPages)}
                className='px-4 py-2 rounded flex items-center gap-2 bg-accent text-accent-contrast hover:bg-accent-hover transition-colors'
                aria-label='Last page'
              >
                <FaStepForward />
              </Link>
            ) : (
              <span
                className='px-4 py-2 rounded flex items-center gap-2 bg-surface-hover/50 text-foreground-muted cursor-not-allowed'
                aria-label='Last page'
              >
                <FaStepForward />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Browse All Pages Navigation */}
      {pagination.totalPages > 3 && (
        <nav aria-label='All painting pages' className='mt-6 flex justify-center'>
          <div className='flex flex-wrap items-center gap-1.5'>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
              <Link
                key={pageNum}
                href={buildPageUrl(pageNum)}
                className={cn(
                  'min-w-10 px-2.5 py-1.5 text-sm rounded-md transition-all duration-200 text-center',
                  pageNum === pagination.page
                    ? 'bg-accent text-accent-contrast font-semibold shadow-sm'
                    : 'text-foreground-subtle hover:bg-surface-hover hover:text-foreground',
                )}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === pagination.page ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default PaginatedPaintingGrid;
