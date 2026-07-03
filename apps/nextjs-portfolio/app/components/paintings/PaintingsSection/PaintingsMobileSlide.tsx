'use client';

import { PaintingSearchCompactCard } from '@/app/components/paintings/PaintingsSearch/PaintingSearchCompactCard';
import { paintingToCompactCardProps } from '@/lib/paintings/paintingCompactCardProps';

// biome-ignore lint/suspicious/noExplicitAny: Sanity / Algolia hit shape varies by query
type PaintingSlideData = Record<string, any>;

type PaintingsMobileSlideProps = {
  painting: PaintingSlideData;
  index: number;
};

/** Mobile carousel slide — same compact card as /paintings search. */
export default function PaintingsMobileSlide({ painting, index }: PaintingsMobileSlideProps) {
  return (
    <div className='w-[min(88vw,340px)] shrink-0'>
      <PaintingSearchCompactCard {...paintingToCompactCardProps(painting, index)} />
    </div>
  );
}
