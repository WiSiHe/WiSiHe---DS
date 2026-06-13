import { ABOUT_PAGE_ENABLED } from '@wisihe/constants';
import type { AboutQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, aboutTravelPhotographyQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import AboutPageClient from './AboutPageClient';
import { buildAboutStructuredData } from './buildAboutStructuredData';
import { normalizeTravelPhotos } from './components/lifeJourneyTypes';

const SITE_URL = 'https://www.wisihe.no';
const DEFAULT_DESCRIPTION =
  'Meet Henrik Wilhelm Sissener (WiSiHe) — frontend developer, design engineer, and digital artist in Oslo. Explore his life map, creative work, and technical projects.';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: aboutQuery, stega: false });
  const about = data as AboutQueryResult | null;
  const name = about?.heroSubtitle ?? 'Henrik Wilhelm Sissener';
  const title = about?.seoTitle ?? `About ${name} | WiSiHe`;
  const description = about?.seoDescription ?? about?.bio ?? DEFAULT_DESCRIPTION;
  const ogImage = about?.portrait
    ? urlForImage(about.portrait)?.width(1200).height(630).quality(85).url()
    : `${SITE_URL}/wisihe.png`;
  const ogAlt = `Portrait of ${name}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/about` },
    authors: [{ name, url: SITE_URL }],
    creator: name,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about`,
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'profile',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }] : [],
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

export default async function AboutPage() {
  if (!ABOUT_PAGE_ENABLED) {
    notFound();
  }

  const [{ data: aboutData }, { data: travelPhotosData }] = await Promise.all([
    sanityFetch({ query: aboutQuery }),
    sanityFetch({ query: aboutTravelPhotographyQuery }),
  ]);
  const about = aboutData as AboutQueryResult;
  const travelPhotos = normalizeTravelPhotos(
    travelPhotosData as import('./components/lifeJourneyTypes').TravelPhotoItem[] | null,
  );

  return (
    <>
      <JsonLd data={buildAboutStructuredData(about)} />
      <AboutPageClient about={about} travelPhotos={travelPhotos} />
    </>
  );
}
