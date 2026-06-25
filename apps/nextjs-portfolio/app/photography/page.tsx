import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Link } from '@/app/components/layout/ProgressLink';
import ScrollToTopButton from '@/app/components/layout/ScrollToTop/ScrollToTop';
import { PhotographyGallery } from '@/app/components/photography/PhotographyGallery';
import { sanityFetch } from '@/sanity/lib/live';
import { photographyListQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';

const SITE_URL = 'https://www.wisihe.no';
const PHOTOGRAPHY_URL = `${SITE_URL}/photography`;
const DEFAULT_DESCRIPTION =
  'Travel and documentary photography from Henrik Sissener — places visited, moments captured, and stories from the road.';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: photographyListQuery, stega: false });
  const photos = (data ?? []) as PhotographyListQueryResult;
  const count = photos.length;
  const title = 'Photography | WiSiHe';
  const description =
    count > 0
      ? `${count} photographs from travels and everyday adventures — browse the gallery or explore places on the about map.`
      : DEFAULT_DESCRIPTION;

  const ogImage = photos[0]?.image
    ? urlForImage(photos[0].image)?.width(1200).height(630).quality(85).url()
    : `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: PHOTOGRAPHY_URL },
    openGraph: {
      title,
      description,
      type: 'website',
      url: PHOTOGRAPHY_URL,
      siteName: 'WiSiHe',
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: 'WiSiHe Photography' }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: { index: true, follow: true },
  };
}

type PhotographyPageProps = {
  searchParams: Promise<{ country?: string }>;
};

export default async function PhotographyPage({ searchParams }: PhotographyPageProps) {
  const { country } = await searchParams;
  const activeCountry = country?.trim().toUpperCase() || null;

  const { data } = await sanityFetch({ query: photographyListQuery });
  const photos = (data ?? []) as PhotographyListQueryResult;

  return (
    <>
      <main className='min-h-screen bg-background'>
        <header className='relative overflow-hidden border-b border-border/40 pt-28 pb-16 sm:pt-32'>
          <div className='pointer-events-none absolute inset-0 bg-accent/5' aria-hidden />
          <div
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_25%,transparent_100%)]'
            aria-hidden
          />
          <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <p className='font-mono text-xs font-semibold uppercase tracking-[0.28em] text-accent'>
              Through the lens
            </p>
            <h1 className='mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
              Photography
            </h1>
            <p className='mt-4 max-w-2xl text-lg leading-relaxed text-foreground-subtle text-pretty'>
              Travel shots and quiet frames from places I&apos;ve been
              {ABOUT_PAGE_LINKS_ENABLED
                ? ' — linked to the same stops on the '
                : ' — grouped by country in the gallery below.'}
              {ABOUT_PAGE_LINKS_ENABLED ? (
                <>
                  <Link href='/about#travel-map-section' className='text-accent hover:underline'>
                    about map
                  </Link>
                  .
                </>
              ) : null}
            </p>
            {photos.length > 0 ? (
              <p className='mt-6 text-sm font-medium text-foreground-muted'>
                {photos.length} photo{photos.length === 1 ? '' : 's'} in the gallery
              </p>
            ) : null}
          </div>
        </header>

        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          {photos.length > 0 ? (
            <PhotographyGallery photos={photos} activeCountry={activeCountry} />
          ) : (
            <div className='rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-20 text-center'>
              <p className='font-serif text-2xl font-bold text-foreground'>Gallery coming soon</p>
              <p className='mt-2 text-foreground-muted'>
                New photographs will appear here as they are published in Sanity Studio.
              </p>
            </div>
          )}
        </div>
      </main>
      <ScrollToTopButton />
    </>
  );
}
