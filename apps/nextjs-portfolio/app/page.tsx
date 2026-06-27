import type {
  AboutQueryResult,
  HomeExtrasQueryResult,
  HomePageQueryResult,
} from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getHeroOverview } from '@/lib/homePageBuilder';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, homeExtrasQuery, homePageQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import HomePageSections from './components/marketing/HomePageSections/HomePageSections';

const HOME_CANONICAL = 'https://www.wisihe.no';
const HOME_DESCRIPTION_FALLBACK =
  "Explore Henrik's portfolio featuring paintings, creative projects, and video works.";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: homePageQuery,
    stega: false,
  });
  const home = data as HomePageQueryResult | null;
  const title = home?.title?.trim() || 'WiSiHe Portfolio';
  const overview = getHeroOverview(home);
  const description =
    portableTextToPlainText(
      overview as unknown as readonly Record<string, unknown>[] | null,
      160,
    ) || HOME_DESCRIPTION_FALLBACK;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: HOME_CANONICAL },
    openGraph: {
      title,
      description,
      url: HOME_CANONICAL,
      siteName: title,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Home() {
  const [{ data: _homepageData }, { data: _aboutData }, { data: _extrasData }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
    sanityFetch({ query: aboutQuery }),
    sanityFetch({ query: homeExtrasQuery }),
  ]);
  const homepage = _homepageData as HomePageQueryResult;
  const about = _aboutData as AboutQueryResult | null;
  const extras = _extrasData as HomeExtrasQueryResult | null;

  if (!homepage) {
    return (
      <div className='container p-4 mx-auto'>
        <h1 className='text-4xl font-bold text-center'>Welcome to My Portfolio</h1>
        <p className='mt-2 text-center'>
          I am a frontend developer who loves to draw and design things.
        </p>
        <p className='mt-4 text-center'>Content is coming soon. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className='overflow-visible bg-background'>
      <Suspense fallback={null}>
        <HomePageSections
          home={homepage}
          about={about}
          extras={extras}
          heroEyebrow={about?.jobTitle}
          heroName={about?.heroSubtitle}
        />
      </Suspense>
    </div>
  );
}
