import type { AboutQueryResult, HomePageQueryResult } from '@wisihe/sanity-queries';
import { shuffleArray } from '@wisihe/utils';
import type { Metadata } from 'next';
import type { PortableTextBlock } from 'next-sanity';
import { Suspense } from 'react';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutQuery, homePageQuery } from '@/sanity/lib/queries';
import { portableTextToPlainText } from '@/sanity/lib/utils';
import HeroImageSection from './components/marketing/HeroSection/HeroSection';
import SkillsSection from './components/marketing/SkillsSection/SkillsSection';
import PaintingsSection from './components/paintings/PaintingsSection/PaintingsSection';
import FeaturedProjects from './components/projects/FeaturedProjects/FeaturedProjects';

const HeroSkeleton = () => (
  <div className='relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-surface overflow-clip'>
    <div className='w-full h-96 bg-surface-elevated animate-pulse rounded-2xl' />
  </div>
);

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
  const description = portableTextToPlainText(home?.overview, 160) || HOME_DESCRIPTION_FALLBACK;

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

const SectionSkeleton = () => (
  <div className='max-w-7xl mx-auto px-4 py-20'>
    <div className='h-8 bg-surface-elevated animate-pulse rounded mb-4' />
    <div className='h-4 bg-surface-elevated animate-pulse rounded mb-8' />
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {[1, 2, 3].map(i => (
        <div key={i} className='h-64 bg-surface-elevated animate-pulse rounded' />
      ))}
    </div>
  </div>
);

export default async function Home() {
  const [{ data: _homepageData }, { data: _aboutData }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
    sanityFetch({ query: aboutQuery }),
  ]);
  const homepage = _homepageData as HomePageQueryResult;
  const about = _aboutData as AboutQueryResult | null;

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

  const {
    overview,
    showcasePaintings,
    showcaseProjects,
    paintingsDescription,
    projectsDescription,
  } = homepage;

  const shuffledHeroPaintings = showcasePaintings ? shuffleArray(showcasePaintings) : [];
  const shuffledHeroProjects = showcaseProjects ? shuffleArray(showcaseProjects) : [];

  // Interleave paintings and projects to ensure a balanced grid of both
  const combinedHeroItems: any[] = [];
  const maxLen = Math.max(shuffledHeroPaintings.length, shuffledHeroProjects.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < shuffledHeroPaintings.length) {
      combinedHeroItems.push(shuffledHeroPaintings[i]);
    }
    if (i < shuffledHeroProjects.length) {
      combinedHeroItems.push(shuffledHeroProjects[i]);
    }
  }

  return (
    <div className='bg-background'>
      <div className='bg-background'>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroImageSection
            items={combinedHeroItems}
            overview={overview as PortableTextBlock[] | null}
            heroEyebrow={about?.jobTitle}
            heroName={about?.heroSubtitle}
          />
        </Suspense>

        <section className='relative pt-24 pb-12'>
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedProjects
              showcaseProjects={showcaseProjects}
              projectsDescription={projectsDescription}
            />
          </Suspense>
        </section>
      </div>

      <section className='bg-surface py-24 px-4 md:px-8'>
        <Suspense fallback={<SectionSkeleton />}>
          <PaintingsSection paintingsDescription={paintingsDescription} />
        </Suspense>
      </section>

      <Suspense fallback={<div className='h-64 bg-surface-elevated animate-pulse' />}>
        <SkillsSection />
      </Suspense>
    </div>
  );
}
