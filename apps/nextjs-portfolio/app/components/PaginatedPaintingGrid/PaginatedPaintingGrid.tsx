'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaintingCard from '../PaintingCard/PaintingCard';
import { GetPaginatedPaintingsResult } from '@/sanity.types';
import { cn } from '@wisihe/utils';
import { FaArrowLeft, FaArrowRight, FaStepBackward, FaStepForward } from 'react-icons/fa';

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
};

const PaginatedPaintingGrid = ({
  initialPaintings,
  initialPagination,
}: PaginatedPaintingGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);

  // Handle URL-based pagination
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const pageNumber = pageParam ? parseInt(pageParam) : 1;

    if (pageNumber !== pagination.page && pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      void loadPage(pageNumber);
    }
  }, [searchParams]);

  const loadPage = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;

    // setLoading(true);
    try {
      const response = await fetch(`/api/paintings?page=${pageNumber}&limit=12`);

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
    } finally {
      //   setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete('page');
    } else {
      params.set('page', pageNumber.toString());
    }
    router.push(`/paintings?${params.toString()}`, { scroll: true });

    // Load the new page data
    void loadPage(pageNumber);
  };

  return (
    <>
      <div className="grid w-full h-full grid-cols-12 gap-2">
        {paintings.map((painting, index) => (
          <div
            key={painting._id}
            className="relative col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3"
          >
            <PaintingCard
              paintingData={painting}
              shouldBeLazy={index < 4} // Prioritize first 4 paintings (visible on most screen sizes)
            />
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center w-full items-center mt-8 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page <= 1}
              className={cn(
                'px-4 py-2 rounded flex items-center gap-2 cursor-pointer',
                pagination.page <= 1
                  ? 'bg-primary/30 text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary/80',
              )}
              aria-label="First page"
            >
              <FaStepBackward />
            </button>

            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className={cn(
                'px-4 py-2 rounded flex items-center gap-2 cursor-pointer',
                pagination.page <= 1
                  ? 'bg-primary/30 text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary/80',
              )}
              aria-label="Previous page"
            >
              <FaArrowLeft />
            </button>

            <span className="px-4 py-2 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className={cn(
                'px-4 py-2 rounded flex items-center gap-2 cursor-pointer',
                pagination.page >= pagination.totalPages
                  ? 'bg-primary/30 text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary/80',
              )}
              aria-label="Next page"
            >
              <FaArrowRight />
            </button>

            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
              className={cn(
                'px-4 py-2 rounded flex items-center gap-2 cursor-pointer',
                pagination.page >= pagination.totalPages
                  ? 'bg-primary/30 text-text-secondary cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary/80',
              )}
              aria-label="Last page"
            >
              <FaStepForward />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaginatedPaintingGrid;
