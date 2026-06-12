import type { AboutQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery } from '@/sanity/lib/queries';
import AboutPageClient from './AboutPageClient';
import { buildAboutStructuredData } from './buildAboutStructuredData';

const SITE_URL = 'https://www.wisihe.no';
const DEFAULT_DESCRIPTION =
  'Meet Henrik Wilhelm Sissener (WiSiHe) — frontend developer, design engineer, and digital artist in Oslo. Explore his life map, creative work, and technical projects.';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: aboutQuery, stega: false });
  const about = data as AboutQueryResult | null;
  const name = about?.heroSubtitle ?? 'Henrik Wilhelm Sissener';
  const title = about?.seoTitle ?? `About ${name} | WiSiHe`;
  const description = about?.seoDescription ?? about?.bio ?? DEFAULT_DESCRIPTION;

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
      images: [{ url: `${SITE_URL}/wisihe.png`, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/wisihe.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const { data: aboutData } = await sanityFetch({ query: aboutQuery });
  const about = aboutData as AboutQueryResult;

  return (
    <>
      <JsonLd data={buildAboutStructuredData(about)} />
      <AboutPageClient about={about} />
    </>
  );
}
