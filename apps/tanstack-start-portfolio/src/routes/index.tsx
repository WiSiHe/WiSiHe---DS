import { createFileRoute } from '@tanstack/react-router';
import type {
  AboutQueryResult,
  HomeExtrasQueryResult,
  HomePageQueryResult,
} from '@wisihe/sanity-queries';
import { Suspense } from 'react';
import HomePageSections from '../components/marketing/HomePageSections/HomePageSections';
import { getHeroOverview } from '../lib/homePageBuilder';
import { portableTextToPlainText } from '../lib/portableText';
import { buildHead } from '../lib/seo';
import { HOME_DESCRIPTION_FALLBACK } from '../lib/siteCopy';
import { getHomeData } from '../server/fns';

type HomeLoaderData = {
  home: HomePageQueryResult;
  about: AboutQueryResult | null;
  extras: HomeExtrasQueryResult | null;
};

export const Route = createFileRoute('/')({
  loader: () => getHomeData(),
  head: ({ loaderData }) => {
    const data = loaderData as HomeLoaderData | undefined;
    const home = data?.home;
    const title = home?.title?.trim() || 'WiSiHe Portfolio';
    const overview = getHeroOverview(home ?? null);
    const description = portableTextToPlainText(overview, 160) || HOME_DESCRIPTION_FALLBACK;

    return buildHead({
      title: `${title} | WiSiHe`,
      description,
      path: '/',
    });
  },
  component: Home,
});

function Home() {
  const { home, about, extras } = Route.useLoaderData() as HomeLoaderData;

  if (!home) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-center text-4xl font-bold'>Welcome to My Portfolio</h1>
        <p className='mt-2 text-center'>
          I am a frontend developer who loves to draw and design things.
        </p>
        <p className='mt-4 text-center'>Content is coming soon. Stay tuned!</p>
      </div>
    );
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
          home={home}
          about={about}
          extras={extras}
          heroEyebrow={about?.jobTitle}
          heroName={about?.heroSubtitle}
        />
      </Suspense>
    </div>
  );
}
