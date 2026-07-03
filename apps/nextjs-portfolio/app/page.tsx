import type {
  AboutQueryResult,
  HomeExtrasQueryResult,
  HomePageQueryResult,
} from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { preload } from 'react-dom';
import { getHeroLcpImageUrl, getHeroOverview } from '@/lib/homePageBuilder';
import { HOME_DESCRIPTION_FALLBACK } from '@/lib/siteCopy';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, homeExtrasQuery, homePageQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import HomePageSections from './components/marketing/HomePageSections/HomePageSections';

const HOME_CANONICAL = 'https://www.wisihe.no';

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

  const heroLcpUrl = getHeroLcpImageUrl(homepage);
  if (heroLcpUrl) {
    preload(heroLcpUrl, { as: 'image', fetchPriority: 'high' });
  }

  return (
    <div className='overflow-visible bg-background'>
      <Suspense
        fallback={
          <div className='relative flex min-h-screen w-full flex-col items-center justify-center bg-background-subtle pt-16 pb-10 md:pt-20 md:pb-12'>
            <div className='w-full max-w-md px-4'>
              <div className='mx-auto h-12 w-48 animate-pulse rounded-lg bg-surface-elevated' />
              <div className='mx-auto mt-6 h-4 w-64 animate-pulse rounded bg-surface-elevated' />
            </div>
          </div>
        }
      >
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
