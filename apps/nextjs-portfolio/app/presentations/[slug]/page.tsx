import { notFound } from 'next/navigation';
import { fetchPresentationSlides } from '@/sanity/lib/fetchPresentations';
import { IntroPresentationOnly } from '../../components/ThreeD/IntroPresentationOnly';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Presentation: ${slug}`,
    description: `View presentation: ${slug}`,
    robots: 'noindex, nofollow', // Test page, don't index
  };
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch presentation slides from Sanity using the slug
  const slides = await fetchPresentationSlides(slug);

  // If no slides found, show 404
  if (!slides || slides.length === 0) {
    notFound();
  }

  return <IntroPresentationOnly slides={slides} />;
}
