import type { HomeSectionCopyQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { homeSectionCopyQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import PaintingsSearchDynamic from '../components/paintings/PaintingsSearch/PaintingsSearchDynamic';

const PAINTINGS_CANONICAL = 'https://www.wisihe.no/paintings';
const PAINTINGS_TITLE_FALLBACK = 'Digital Art Gallery';
const PAINTINGS_DESCRIPTION_FALLBACK =
  'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.';
const PAINTINGS_OG_IMAGE = {
  url: 'https://www.wisihe.no/images/hell.jpg',
  width: 1200,
  height: 630,
  alt: "Digital art gallery showcasing WiSiHe's creative paintings and illustrations",
};

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

export default async function PaintingsPage() {
  const { data } = await sanityFetch({ query: homeSectionCopyQuery });
  const home = data as HomeSectionCopyQueryResult | null;
  const pageTitle = home?.paintingsTitle?.trim() || PAINTINGS_TITLE_FALLBACK;

  return (
    <>
      <div className='w-full min-h-screen pt-32 pb-20 mx-auto max-w-7xl px-4'>
        <div className='pb-5 flex items-baseline gap-3'>
          <h1 className='font-semibold text-foreground text-2xl md:text-3xl'>{pageTitle}</h1>
        </div>
        <PaintingsSearchDynamic />
      </div>
      <ScrollToTopButton />
    </>
  );
}
