import { sanityFetch } from '@/sanity/lib/live';
import { getAllProjects } from '@/sanity/lib/queries';
import { isEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectCategories from '../components/ProjectCategories/ProjectCategories';

export const metadata: Metadata = {
  title: 'Projects | WiSiHe',
  description: 'Explore a collection of projects showcasing various creative and technical works.',
  alternates: {
    canonical: 'https://www.wisihe.no/projects',
  },
  openGraph: {
    title: 'Projects | WiSiHe',
    description:
      'Explore a collection of projects showcasing various creative and technical works.',
    url: 'https://www.wisihe.no/projects',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.wisihe.no/images/hell.jpg', // Updated to point to your image
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
    images: ['https://www.wisihe.no/images/hell.jpg'], // Updated to point to your image
  },
};

export default async function ProjectsPage() {
  const [{ data }] = await Promise.all([sanityFetch({ query: getAllProjects })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { ongoingProjects, pastProjects, tags } = data;

  return (
    <div className="w-full min-h-screen p-4 pt-32 mx-auto max-w-7xl">
      <div className="w-full pb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">Projects</h1>
        <p className="text-base md:text-lg text-foreground-subtle max-w-prose text-pretty leading-relaxed">
          A gallery of some of my projects, both creative and technical.
        </p>
      </div>
      <ProjectCategories
        ongoingProjects={ongoingProjects}
        pastProjects={pastProjects}
        tags={tags}
      />
    </div>
  );
}
