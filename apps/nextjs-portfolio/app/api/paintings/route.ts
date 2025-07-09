import { sanityFetch } from "@/sanity/lib/live";
import { getPaginatedPaintings, getPaintingsCount } from "@/sanity/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const start = (page - 1) * limit;
    const end = start + limit;

    const results = await Promise.all([
      sanityFetch({
        query: getPaginatedPaintings,
        params: { start, end },
      }),
      sanityFetch({
        query: getPaintingsCount,
      }),
    ]);

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
    console.error("Error fetching paginated paintings:", error);
    return NextResponse.json(
      { error: "Failed to fetch paintings" },
      { status: 500 },
    );
  }
}
