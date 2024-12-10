import { sanityFetch } from '@/sanity/lib/live';
import { getAllProjects } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <div className="min-h-screen p-4 mt-16 bg-dark">
      <section className="mx-auto max-w-screen-2xl">
        <div className="prose prose-invert">
          <h1>Projects</h1>
          <p>A gallery of some of my projects</p>
        </div>
        <section className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project._id}
              className="relative rounded-lg bg-tertiary overflow-clip text-dark"
            >
              <div className="relative aspect-video">
                <Image
                  src={urlForImage(project.image)?.url() || ''}
                  alt={project.title}
                  fill
                  className="object-cover scale-105"
                />
              </div>
              <div className="p-4">
                <Link
                  href={`projects/${project.slug}`}
                  className="before:absolute before:inset-0 before:z-0"
                >
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                </Link>
                <p className="line-clamp-3">{project.description}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
