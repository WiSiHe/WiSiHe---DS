import type { GetAllProjectsResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllProjects } from '@/sanity/lib/queries';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import ProjectCategories from '../components/projects/ProjectCategories/ProjectCategories';

export const metadata: Metadata = {
  title: 'Projects | WiSiHe',
  description:
    'A collection of creative and technical projects — design systems, web apps, games, and more.',
  alternates: { canonical: 'https://www.wisihe.no/projects' },
  openGraph: {
    title: 'Projects | WiSiHe',
    description:
      'A collection of creative and technical projects — design systems, web apps, games, and more.',
    url: 'https://www.wisihe.no/projects',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://www.wisihe.no/images/hell.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | WiSiHe',
    description:
      'A collection of creative and technical projects — design systems, web apps, games, and more.',
    images: ['https://www.wisihe.no/images/hell.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default async function ProjectsPage() {
  const { data } = await sanityFetch({ query: getAllProjects });
  const { ongoingProjects, pastProjects, tags } = (data ?? {}) as GetAllProjectsResult;

  return (
    <>
      <div className='flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-7xl'>
        <div className='w-full p-4'>
          <div className='pb-8'>
            <h1 className='font-semibold text-foreground text-3xl md:text-4xl mb-3'>Projects</h1>
            <p className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed'>
              A mix of professional work, side projects, and experiments — filtered by tag.
            </p>
          </div>

          <ProjectCategories
            ongoingProjects={ongoingProjects ?? []}
            pastProjects={pastProjects ?? []}
            tags={tags ?? []}
          />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
