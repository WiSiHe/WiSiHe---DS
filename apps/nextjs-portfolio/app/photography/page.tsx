import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import type { Metadata } from 'next';
import { Link } from '@/app/components/layout/ProgressLink';
import ScrollToTopButton from '@/app/components/layout/ScrollToTop/ScrollToTop';
import { PhotographyGallery } from '@/app/components/photography/PhotographyGallery';
import { photographySectionLabelClass } from '@/app/components/photography/photographyStyles';
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
      <main className='relative mx-auto min-h-screen w-full max-w-screen-2xl overflow-hidden px-4 pb-24 pt-32 lg:px-8'>
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,520px)] bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent)]'
          aria-hidden
        />
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(to_bottom,var(--color-background),transparent)]'
          aria-hidden
        />

        <header className='relative pb-10 lg:pb-12'>
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl space-y-3'>
              <p className={cn(photographySectionLabelClass, 'text-accent')}>Through the lens</p>
              <h1 className='font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]'>
                Photography
              </h1>
              <p className='max-w-prose text-base leading-relaxed text-foreground-subtle text-pretty md:text-lg'>
                Travel shots and quiet frames from places I&apos;ve been
                {ABOUT_PAGE_LINKS_ENABLED
                  ? ' — linked to the same stops on the '
                  : ' — grouped by country below.'}
                {ABOUT_PAGE_LINKS_ENABLED ? (
                  <>
                    <Link href='/about#travel-map-section' className='text-accent hover:underline'>
                      about map
                    </Link>
                    .
                  </>
                ) : null}
              </p>
            </div>

            {photos.length > 0 ? (
              <div className='flex shrink-0 flex-col items-start gap-2 lg:items-end lg:pb-1'>
                <span className='inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent backdrop-blur-sm'>
                  {photos.length} {photos.length === 1 ? 'frame' : 'frames'}
                </span>
                <p className='text-xs text-foreground-muted'>Documentary & travel</p>
              </div>
            ) : null}
          </div>

          <div
            className='mt-8 h-px w-full bg-linear-to-r from-transparent via-border/70 to-transparent'
            aria-hidden
          />
        </header>

        {photos.length > 0 ? (
          <PhotographyGallery photos={photos} activeCountry={activeCountry} />
        ) : (
          <div className='relative rounded-2xl border border-dashed border-border/70 bg-surface/30 px-6 py-20 text-center backdrop-blur-sm'>
            <p className='font-serif text-2xl font-bold text-foreground'>Gallery coming soon</p>
            <p className='mt-2 text-foreground-muted'>
              New photographs will appear here as they are published in Sanity Studio.
            </p>
          </div>
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
}
