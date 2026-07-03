'use client';

import Link from 'next/link';
import PaintingCard from '@/app/components/paintings/PaintingCard/PaintingCard';
import { paintingSlug } from '@/lib/paintings/paintingCompactCardProps';

type PaintingsDesktopShowcaseProps = {
  // biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
  paintings: any[];
};

const PaintingsDesktopShowcase = ({ paintings }: PaintingsDesktopShowcaseProps) => {
  const items = paintings.filter(p => p.image && paintingSlug(p));

  if (!items.length) {
    return null;
  }

  return (
    <section className='hidden md:block' aria-label='Featured paintings gallery'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='columns-2 gap-3 md:columns-3 lg:columns-4'>
          {items.map((painting, index) => (
            <div key={painting._id} className='mb-3 break-inside-avoid'>
              <PaintingCard
                paintingData={painting}
                shouldBeLazy={index < 4}
                isNsfwFilterActive={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-16 flex flex-col items-center justify-center gap-4 text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4'>
        <p>Like what you see?</p>
        <Link
          href='/paintings'
          className='rounded-full bg-accent px-4 py-2 text-accent-contrast transition-all duration-300 hover:bg-accent-hover'
        >
          Explore all paintings
        </Link>
      </div>
    </section>
  );
};

export default PaintingsDesktopShowcase;
