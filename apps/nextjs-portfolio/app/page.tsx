import type { HomePageQueryResult } from '@wisihe/sanity-queries';
import { shuffleArray } from '@wisihe/utils';
import { Suspense } from 'react';
import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import HeroImageSection from './components/marketing/HeroSection/HeroSection';
import SkillsSection from './components/marketing/SkillsSection/SkillsSection';
import PaintingsSection from './components/paintings/PaintingsSection/PaintingsSection';
import FeaturedProjects from './components/projects/FeaturedProjects/FeaturedProjects';

const HeroSkeleton = () => (
  <div className='relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-surface overflow-clip'>
    <div className='w-full h-96 bg-surface-elevated animate-pulse rounded-2xl' />
  </div>
);

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
  const { data: homepage }: { data: HomePageQueryResult } = await sanityFetch({
    query: homePageQuery,
  });

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

  const { showcasePaintings, showcaseProjects, paintingsDescription } = homepage;

  const shuffledHeroPaintings = showcasePaintings ? shuffleArray(showcasePaintings) : [];

  return (
    <div className='bg-background'>
      <div className='bg-background'>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroImageSection paintings={shuffledHeroPaintings} projects={showcaseProjects} />
        </Suspense>

        <section className='relative pt-24 pb-12'>
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedProjects showcaseProjects={showcaseProjects} />
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
