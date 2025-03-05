import { sanityFetch } from '@/sanity/lib/live';
import { getAllVideos } from '@/sanity/lib/queries';
import { isEmptyObject } from '@wisihe/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideosPage } from '../components/pages/VideosPage';

export const metadata: Metadata = {
  title: 'Creative Video Gallery | WiSiHe',
  description:
    'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
  openGraph: {
    title: 'Creative Video Gallery | WiSiHe',
    description:
      'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
    images: ['/images/video-gallery-og.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Video Gallery | WiSiHe',
    description:
      'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
  },
};

export default async function Videos() {
  const [{ data }] = await Promise.all([sanityFetch({ query: getAllVideos })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { videos } = data;

  return (
    <section className="min-h-screen p-4 pt-20 text-white mx-auto max-w-(--breakpoint-2xl)">
      <h1 className="mb-2 text-4xl font-bold">Creative Video Gallery</h1>
      <p className="mb-6 text-xl">
        From timelapse drawings to game development and animations — a showcase
        of my digital creations in motion
      </p>

      <VideosPage videos={videos} />
    </section>
  );
}
