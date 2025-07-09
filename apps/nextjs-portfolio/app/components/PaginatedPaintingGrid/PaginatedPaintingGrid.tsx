"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaintingCard from "../PaintingCard/PaintingCard";
import { GetPaginatedPaintingsResult } from "@/sanity.types";
import { cn } from "@wisihe/utils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
  const [pagination, setPagination] =
    useState<PaginationInfo>(initialPagination);

  // Handle URL-based pagination
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam) : 1;

    if (
      pageNumber !== pagination.page &&
      pageNumber >= 1 &&
      pageNumber <= pagination.totalPages
    ) {
      void loadPage(pageNumber);
    }
  }, [searchParams]);

  const loadPage = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.totalPages) return;

    // setLoading(true);
    try {
      const response = await fetch(
        `/api/paintings?page=${pageNumber}&limit=12`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch paintings");
      }

      const data = (await response.json()) as ApiResponse;

      if (data.paintings) {
        setPaintings(data.paintings);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error loading paintings:", error);
    } finally {
      //   setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    router.push(`/paintings?${params.toString()}`, { scroll: true });

    void pageNumber;
  };

  return (
    <>
      <div className="w-full py-4 text-white">
        <p className="no-results-message">
          Showing {paintings.length} of {pagination.totalCount} paintings
          {pagination.totalPages > 1 &&
            ` (Page ${pagination.page} of ${pagination.totalPages})`}
        </p>
      </div>

      <>
        <div className="grid w-full h-full grid-cols-12 gap-4">
          {paintings.map((painting) => (
            <div
              key={painting._id}
              className="relative col-span-full sm:col-span-6 md:col-span-3"
            >
              <PaintingCard paintingData={painting} />
            </div>
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center w-full ring items-center mt-8 mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={cn(
                  "px-4 py-2 rounded flex items-center gap-2",
                  pagination.page <= 1
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700",
                )}
              >
                <FaArrowLeft /> Previous
              </button>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className={cn(
                  "px-4 py-2 rounded flex items-center gap-2",
                  pagination.page >= pagination.totalPages
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700",
                )}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default PaginatedPaintingGrid;
