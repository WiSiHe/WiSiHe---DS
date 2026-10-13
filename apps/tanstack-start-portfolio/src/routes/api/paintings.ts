import { createFileRoute } from '@tanstack/react-router';
import {
  type GetPaginatedPaintingsResult,
  getFilteredPaginatedPaintings,
  getFilteredPaintingsCount,
  getPaginatedPaintings,
  getPaintingsCount,
} from '@wisihe/sanity-queries';
import { getSanityClientForRequest } from '@/lib/sanity';

export const Route = createFileRoute('/api/paintings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
          const limit = Number.parseInt(url.searchParams.get('limit') || '12', 10);
          const filter = url.searchParams.get('filter') || '';

          let filters = filter
            ? filter
                .split(',')
                .map(f => f.trim())
                .filter(f => f !== '')
            : [];
          filters = filters.slice(0, 5);

          const start = (page - 1) * limit;
          const end = start + limit;

          const sanity = getSanityClientForRequest(request);
          let paintings: GetPaginatedPaintingsResult;
          let totalCount: number;

          if (filters.length > 0) {
            const filterParams: Record<string, string> = {};
            for (let i = 0; i < 5; i++) {
              filterParams[`filter${i}`] = filters[i] || '';
            }
            const [paintingsResult, countResult] = await Promise.all([
              sanity.fetch<GetPaginatedPaintingsResult>(getFilteredPaginatedPaintings, {
                start,
                end,
                ...filterParams,
              }),
              sanity.fetch<number>(getFilteredPaintingsCount, filterParams),
            ]);
            paintings = paintingsResult;
            totalCount = countResult;
          } else {
            const [paintingsResult, countResult] = await Promise.all([
              sanity.fetch<GetPaginatedPaintingsResult>(getPaginatedPaintings, { start, end }),
              sanity.fetch<number>(getPaintingsCount),
            ]);
            paintings = paintingsResult;
            totalCount = countResult;
          }

          const hasMore = end < totalCount;

          return Response.json({
            paintings,
            pagination: {
              page,
              limit,
              totalCount,
              hasMore,
              totalPages: Math.ceil(totalCount / limit),
            },
          });
        } catch (error) {
          console.error('Error fetching paginated paintings:', error);
          return Response.json({ error: 'Failed to fetch paintings' }, { status: 500 });
        }
      },
    },
  },
});
