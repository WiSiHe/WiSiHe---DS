import type { GetPaginatedPaintingsResult } from '@wisihe/sanity-queries';
import { type NextRequest, NextResponse } from 'next/server';
import { sanityFetch } from '@/sanity/lib/live';
import {
  getFilteredPaginatedPaintings,
  getFilteredPaintingsCount,
  getPaginatedPaintings,
  getPaintingsCount,
} from '@/sanity/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const filter = searchParams.get('filter') || '';

    // Parse multiple filters
    let filters = filter
      ? filter
          .split(',')
          .map(f => f.trim())
          .filter(f => f !== '')
      : [];
    filters = filters.slice(0, 5); // Limit to 5 filters

    const start = (page - 1) * limit;
    const end = start + limit;

    let paintings: GetPaginatedPaintingsResult;
    let totalCount: number;

    if (filters.length > 0) {
      const filterParams: Record<string, string> = {};
      for (let i = 0; i < 5; i++) {
        filterParams[`filter${i}`] = filters[i] || '';
      }
      const [paintingsResult, countResult] = await Promise.all([
        sanityFetch({
          query: getFilteredPaginatedPaintings,
          params: { start, end, ...filterParams },
        }),
        sanityFetch({ query: getFilteredPaintingsCount, params: { ...filterParams } }),
      ]);
      paintings = paintingsResult.data as GetPaginatedPaintingsResult;
      totalCount = countResult.data as number;
    } else {
      const [paintingsResult, countResult] = await Promise.all([
        sanityFetch({ query: getPaginatedPaintings, params: { start, end } }),
        sanityFetch({ query: getPaintingsCount }),
      ]);
      paintings = paintingsResult.data as GetPaginatedPaintingsResult;
      totalCount = countResult.data as number;
    }

    const hasMore = end < totalCount;

    return NextResponse.json({
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
    return NextResponse.json({ error: 'Failed to fetch paintings' }, { status: 500 });
  }
}
