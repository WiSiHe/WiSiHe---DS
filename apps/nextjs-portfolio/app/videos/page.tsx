import { isEmptyObject } from '@wisihe/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { getAllVideos } from '@/sanity/lib/queries';
import { VideosPage } from '../components/pages/VideosPage';

export const metadata: Metadata = {
  title: 'Creative Video Gallery | WiSiHe',
  description:
    'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
  alternates: {
    canonical: 'https://www.wisihe.no/videos',
  },
  openGraph: {
    title: 'Creative Video Gallery | WiSiHe',
    description:
      'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
    url: 'https://www.wisihe.no/videos',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.wisihe.no/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: 'Creative video gallery showcasing digital animations and timelapse drawings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Video Gallery | WiSiHe',
    description:
      'Explore my digital creations in motion - from timelapse drawings to game development and animations.',
    images: ['https://www.wisihe.no/images/hell.jpg'],
  },
};

export default async function Videos() {
  const [{ data }] = await Promise.all([sanityFetch({ query: getAllVideos })]);

  if (isEmptyObject(data)) {
    return notFound();
  }

  const { videos } = data;

  // Create structured data for video collection
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Creative Video Collection',
    description:
      'A collection of digital creations in motion - from timelapse drawings to game development and animations',
    numberOfItems: videos?.length || 0,
    itemListElement:
      videos?.map((video: Record<string, unknown>, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          '@id': `https://www.wisihe.no/videos#${(video['slug'] as string) || index}`,
          name: video['title'] as string,
          description: video['description'] as string,
          thumbnailUrl: video['thumbnailUrl'] as string,
          uploadDate: video['publishedAt'] as string,
          creator: {
            '@type': 'Person',
            name: 'Henrik Sissener',
            url: 'https://www.wisihe.no',
          },
        },
      })) || [],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <section className='w-full min-h-screen p-4 pt-32 mx-auto max-w-7xl'>
        <div className='w-full pb-6'>
          <h1 className='text-3xl md:text-4xl font-bold font-serif text-foreground mb-3'>Videos</h1>
          <p className='text-base md:text-lg text-foreground-subtle max-w-prose text-pretty leading-relaxed'>
            From timelapse drawings to game development and animations — a showcase of my digital
            creations in motion
          </p>
        </div>

        <VideosPage videos={videos} />
      </section>
    </>
  );
}
