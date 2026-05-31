import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery } from '@/sanity/lib/queries';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About | WiSiHe — Henrik Sissener',
  description:
    'Frontend developer and digital artist based in Norway. I build performant web experiences and create digital paintings.',
  alternates: { canonical: 'https://www.wisihe.no/about' },
  openGraph: {
    title: 'About | WiSiHe — Henrik Sissener',
    description:
      'Frontend developer and digital artist based in Norway. I build performant web experiences and create digital paintings.',
    url: 'https://www.wisihe.no/about',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'profile',
  },
};

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: aboutQuery });
  // biome-ignore lint/suspicious/noExplicitAny: AboutQuery resolves to null until typegen is fixed
  const about = (data ?? {}) as any;

  const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: about.heroSubtitle ?? 'Henrik Sissener',
    jobTitle: about.jobTitle ?? 'Frontend Developer & Digital Artist',
    description: about.bio ?? '',
    url: 'https://www.wisihe.no',
    image: 'https://www.wisihe.no/wisihe.png',
    sameAs: (about.socialLinks ?? []).map((l: { url: string }) => l.url).filter(Boolean),
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Design Systems',
      'Digital Painting',
      'Procreate',
      'Three.js',
    ],
    nationality: { '@type': 'Country', name: 'Norway' },
  };

  return (
    <>
      <JsonLd data={personStructuredData} />
      <AboutPageClient about={about} />
    </>
  );
}
