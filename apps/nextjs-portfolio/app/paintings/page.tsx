import type { Metadata } from 'next';
import ScrollToTopButton from '../components/layout/ScrollToTop/ScrollToTop';
import PaintingsSearch from '../components/paintings/PaintingsSearch/PaintingsSearch';

// Generate metadata dynamically to ensure canonical URLs point to base page
// This prevents duplicate indexing of paginated/filtered URLs
export async function generateMetadata(): Promise<Metadata> {
  // Always canonicalize to the base /paintings URL to prevent duplicate indexing
  // of paginated or filtered variations
  return {
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
      // Prevent indexing of paginated/filtered variations
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function PaintingsPage() {
  return (
    <>
      <div className='w-full min-h-screen pt-32 pb-20 mx-auto max-w-7xl px-4'>
        <div className='pb-5 flex items-baseline gap-3'>
          <h1 className='font-semibold text-foreground text-2xl md:text-3xl'>
            Digital Art Gallery
          </h1>
        </div>
        <PaintingsSearch />
      </div>
      <ScrollToTopButton />
    </>
  );
}
