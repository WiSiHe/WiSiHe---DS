import { sanityFetch } from '@/sanity/lib/live';
import {
  getPaginatedPaintings,
  getPaintingsCount,
  getFilteredPaginatedPaintings,
  getFilteredPaintingsCount,
} from '@/sanity/lib/queries';
import { NextRequest, NextResponse } from 'next/server';
import { GetPaginatedPaintingsResult } from '@wisihe/sanity-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
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

    // Use filtered queries if filters are provided, otherwise use regular queries
    const paintingsQuery =
      filters.length > 0 ? getFilteredPaginatedPaintings : getPaginatedPaintings;
    const countQuery = filters.length > 0 ? getFilteredPaintingsCount : getPaintingsCount;

    let results: [{ data: GetPaginatedPaintingsResult }, { data: number }];

    if (filters.length > 0) {
      // Build filter params for GROQ
      const filterParams: Record<string, string> = {};
      for (let i = 0; i < 5; i++) {
        filterParams[`filter${i}`] = filters[i] || '';
      }

      results = await Promise.all([
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
      results = await Promise.all([
        sanityFetch({
          query: paintingsQuery,
          params: { start, end },
        }),
        sanityFetch({
          query: countQuery,
        }),
      ]);
    }

    const paintings = results[0].data;
    const totalCount = results[1].data;

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
