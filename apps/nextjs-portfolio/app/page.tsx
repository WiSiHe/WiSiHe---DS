import { HomePageQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import { Metadata } from 'next';
import { PortableTextBlock } from 'next-sanity';
import { Suspense } from 'react';
import FeaturedProjects from './components/FeaturedProjects/FeaturedProjects';
import HeroImageSection from './components/HeroSection/HeroSection';
import PaintingsSection from './components/PaintingsSection/PaintingsSection';
import SkillsSection from './components/SkillsSection/SkillsSection';

export const metadata: Metadata = {
  title: 'Henrik Sissener | Frontend Developer & Creative',
  description:
    'Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.',
  keywords: [
    'frontend developer',
    'React',
    'Svelte',
    'portfolio',
    'web development',
    'game development',
    'art',
  ],
  openGraph: {
    title: 'Henrik Sissener | Frontend Developer & Creative',
    description:
      'Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Henrik Sissener Portfolio',
    images: [
      {
        url: '/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: 'Henrik Sissener Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henrik Sissener | Frontend Developer & Creative',
    description:
      'Portfolio of Henrik Sissener, a frontend developer specializing in React and Svelte. Explore my projects, artwork, and development skills.',
    images: ['/images/hell.jpg'],
  },
};

type Painting = NonNullable<NonNullable<HomePageQueryResult>['showcasePaintings']>[number];

// Fisher-Yates shuffle algorithm
function shuffleArray(array: Painting[]): Painting[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Loading skeleton components
const HeroSkeleton = () => (
  <div className="relative flex flex-col items-end justify-center h-fit w-full px-4 pt-20 pb-10 md:px-10 lg:min-h-[70vh] lg:pt-0 bg-surface overflow-clip">
    <div className="w-full h-96 bg-surface-elevated animate-pulse rounded-2xl" />
  </div>
);

const SectionSkeleton = () => (
  <div className="max-w-screen-xl mx-auto px-4 py-20">
    <div className="h-8 bg-surface-elevated animate-pulse rounded mb-4" />
    <div className="h-4 bg-surface-elevated animate-pulse rounded mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-64 bg-surface-elevated animate-pulse rounded" />
      ))}
    </div>
  </div>
);

export default async function Home() {
  const [{ data: homepage }]: [{ data: HomePageQueryResult }] = await Promise.all([
    sanityFetch({ query: homePageQuery }),
  ]);

  if (!homepage) {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-4xl font-bold text-center">Welcome to My Portfolio</h1>
        <p className="mt-2 text-center">
          I am a frontend developer who loves to draw and design things.
        </p>
        <p className="mt-4 text-center">Content is coming soon. Stay tuned!</p>
      </div>
    );
  }

  const { showcasePaintings, showcaseProjects } = homepage;

  const shuffledHeroPaintings = showcasePaintings ? shuffleArray(showcasePaintings) : [];

  const shuffledCarouselPaintings = showcasePaintings ? shuffleArray(showcasePaintings) : [];

  const paintingsDescription = homepage.paintingsDescription as PortableTextBlock[];

  return (
    <div className="bg-background">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroImageSection paintings={shuffledHeroPaintings} />
      </Suspense>

      <section className="px-4 py-20 space-y-10 lg:space-y-42 md:px-8 bg-gradient-to-b from-tertiary to-tertiary/70">
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedProjects showcaseProjects={showcaseProjects} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <PaintingsSection
            paintings={shuffledCarouselPaintings}
            paintingsDescription={paintingsDescription}
          />
        </Suspense>
      </section>

      <Suspense fallback={<div className="h-64 bg-surface-elevated animate-pulse" />}>
        <SkillsSection />
      </Suspense>
    </div>
  );
}
