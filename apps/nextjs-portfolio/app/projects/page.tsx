import type { Metadata } from 'next';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import ProjectsSearch from '../components/projects/ProjectsSearch/ProjectsSearch';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Projects | WiSiHe',
    description:
      'Explore a searchable collection of projects — creative and technical work with filters by status, type, and tags.',
    alternates: {
      canonical: 'https://www.wisihe.no/projects',
    },
    openGraph: {
      title: 'Projects | WiSiHe',
      description:
        'Explore a searchable collection of projects — creative and technical work with filters by status, type, and tags.',
      url: 'https://www.wisihe.no/projects',
      siteName: 'WiSiHe',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://www.wisihe.no/images/hell.jpg',
          width: 1200,
          height: 630,
          alt: 'A preview of various projects from WiSiHe',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Projects | WiSiHe',
      description:
        'Explore a searchable collection of projects — creative and technical work with filters by status, type, and tags.',
      images: ['https://www.wisihe.no/images/hell.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function ProjectsPage() {
  return (
    <>
      <div className='flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-7xl'>
        <div className='w-full p-4'>
          <div className='pb-4'>
            <h1 className='font-semibold text-foreground text-3xl md:text-4xl mb-3'>Projects</h1>
            <p className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed'>
              Search and filter case studies and builds by status, project type, and tags.
            </p>
          </div>

          <ProjectsSearch />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
