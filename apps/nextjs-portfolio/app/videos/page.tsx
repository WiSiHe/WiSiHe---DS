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
    <section className="min-h-screen p-4 pt-32 mx-auto max-w-(--breakpoint-2xl)">
      <div className="pb-4 ">
        <h1 className="font-semibold">Videos</h1>
        <p>
          From timelapse drawings to game development and animations — a showcase of my digital
          creations in motion
        </p>
      </div>

      <VideosPage videos={videos} />
    </section>
  );
}
