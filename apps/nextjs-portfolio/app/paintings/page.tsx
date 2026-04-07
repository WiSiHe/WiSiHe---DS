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
      <div className='flex items-start justify-start w-full h-full min-h-screen pt-32 mx-auto max-w-7xl'>
        <div className='w-full p-4'>
          <div className='pb-4'>
            <h1 className='font-semibold text-foreground text-3xl md:text-4xl mb-3'>
              Digital Art Gallery
            </h1>
            <p className='text-foreground-subtle text-base md:text-lg max-w-prose text-pretty leading-relaxed'>
              A curated collection of my digital paintings and artwork, exploring themes of
              imagination, storytelling, and visual creativity. Each piece represents a moment of
              artistic expression and digital craftsmanship.
            </p>
          </div>

          <PaintingsSearch />
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
