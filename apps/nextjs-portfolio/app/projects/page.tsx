import { sanityFetch } from '@/sanity/lib/live';
import { getAllProjects } from '@/sanity/lib/queries';
import { isEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectCategories from '../components/ProjectCategories/ProjectCategories';

export const metadata: Metadata = {
  title: 'Projects | WiSiHe',
  description:
    'Explore a collection of projects showcasing various creative and technical works.',
  alternates: {
    canonical: 'https://wisihe.no/projects',
  },
  openGraph: {
    title: 'Projects | WiSiHe',
    description:
      'Explore a collection of projects showcasing various creative and technical works.',
    url: 'https://wisihe.no/projects',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://wisihe.no/images/hell.jpg', // Updated to point to your image
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
      'Explore a collection of projects showcasing various creative and technical works.',
    images: ['https://wisihe.no/images/hell.jpg'], // Updated to point to your image
  },
};

export default async function ProjectsPage() {
  const [{ data }] = await Promise.all([
    sanityFetch({ query: getAllProjects }),
  ]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { projects } = data;

  return (
    <div className="min-h-screen p-4 pt-20 bg-tertiary text-dark overflow-x-clip">
      <section className="mx-auto max-w-screen-2xl">
        <div className="pb-4 ">
          <h1>
            <strong>Projects</strong>
          </h1>
          <p>A gallery of some of my projects, both creative and technical.</p>
        </div>
        <ProjectCategories projects={projects} />
      </section>
    </div>
  );
}
