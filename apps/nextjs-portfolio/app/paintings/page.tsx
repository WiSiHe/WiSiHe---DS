import type { Metadata } from 'next';
import { Suspense } from 'react';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import PaintingsSearch from '../components/paintings/PaintingsSearch/PaintingsSearch';

export const metadata: Metadata = {
  title: 'Digital Art Gallery',
  description:
    'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
  alternates: {
    canonical: 'https://www.wisihe.no/paintings',
  },
  openGraph: {
    title: 'Digital Art Gallery',
    description:
      'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
    url: 'https://www.wisihe.no/paintings',
    siteName: 'WiSiHe',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.wisihe.no/images/hell.jpg',
        width: 1200,
        height: 630,
        alt: "Digital art gallery showcasing WiSiHe's creative paintings and illustrations",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Art Gallery',
    description:
      'Explore my collection of digital paintings and artwork, featuring imaginative landscapes, character designs, and creative visual storytelling.',
    images: ['https://www.wisihe.no/images/hell.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function PaintingsPage() {
  return (
    <>
      <div className='w-full min-h-screen pt-32 pb-20 mx-auto max-w-7xl px-4'>
        <div className='pb-5 flex items-baseline gap-3'>
          <h1 className='font-semibold text-foreground text-2xl md:text-3xl'>
            Digital Art Gallery
          </h1>
        </div>
        {/* Suspense is required by Next.js App Router when InstantSearchNext uses routing={true}
            (which internally calls useSearchParams). Without it, the search silently fails on
            first hydration in production, causing the skeleton to never resolve. */}
        <Suspense>
          <PaintingsSearch />
        </Suspense>
      </div>
      <ScrollToTopButton />
    </>
  );
}
