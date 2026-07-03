import type { HomeSectionCopyQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchPaintingsSearch } from '@/lib/algolia/paintingsSearch/fetchPaintingsSearch.server';
import { parsePaintingsSearchParams } from '@/lib/algolia/paintingsSearch/parsePaintingsSearchParams';
import { PAINTINGS_DESCRIPTION_FALLBACK } from '@/lib/siteCopy';
import { sanityFetch } from '@/sanity/lib/live';
import { homeSectionCopyQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import PaintingsSearch from '../components/paintings/PaintingsSearch/PaintingsSearch';
import PaintingsSearchSkeleton from '../components/paintings/PaintingsSearch/PaintingsSearchSkeleton';

const PAINTINGS_CANONICAL = 'https://www.wisihe.no/paintings';
const PAINTINGS_TITLE_FALLBACK = 'Digital Art Gallery';
const PAINTINGS_OG_IMAGE = {
  url: 'https://www.wisihe.no/images/hell.jpg',
  width: 1200,
  height: 630,
  alt: 'Digital paintings and illustrations by Henrik Sissener (WiSiHe)',
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: homeSectionCopyQuery,
    stega: false,
  });
  const home = data as HomeSectionCopyQueryResult | null;
  const title = home?.paintingsTitle?.trim() || PAINTINGS_TITLE_FALLBACK;
  const description =
    portableTextToPlainText(home?.paintingsDescription, 160) || PAINTINGS_DESCRIPTION_FALLBACK;

  return {
    title,
    description,
    alternates: { canonical: PAINTINGS_CANONICAL },
    openGraph: {
      title,
      description,
      url: PAINTINGS_CANONICAL,
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'website',
      images: [PAINTINGS_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [PAINTINGS_OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function PaintingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const rawParams = await searchParams;
  const parsedSearch = parsePaintingsSearchParams({
    q: firstParam(rawParams['q']),
    tag: firstParam(rawParams['tag']),
    color: firstParam(rawParams['color']),
    sale: firstParam(rawParams['sale']),
    sort: firstParam(rawParams['sort']),
    p: firstParam(rawParams['p']),
  });

  const [{ data }, initialResults] = await Promise.all([
    sanityFetch({ query: homeSectionCopyQuery }),
    fetchPaintingsSearch(parsedSearch),
  ]);
  const home = data as HomeSectionCopyQueryResult | null;
  const pageTitle = home?.paintingsTitle?.trim() || PAINTINGS_TITLE_FALLBACK;

  return (
    <>
      <div className='w-full min-h-screen pt-32 pb-20 mx-auto max-w-7xl px-4'>
        <div className='pb-5 flex items-baseline gap-3'>
          <h1 className='font-semibold text-foreground text-2xl md:text-3xl'>{pageTitle}</h1>
        </div>
        <Suspense fallback={<PaintingsSearchSkeleton />}>
          <PaintingsSearch initialResults={initialResults} />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </>
  );
}
