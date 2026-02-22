import { sanityFetch } from '@/sanity/lib/live';
import { randomPaintingsQuery } from '@/sanity/lib/queries';
import { PortableText, PortableTextBlock } from 'next-sanity';
import PaintingsCarousel from './PaintingsCarousel';
import { RandomPaintingsQueryResult, BlockContent } from '@wisihe/sanity-queries';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const PaintingsSection = async ({ paintingsDescription }: { paintingsDescription: BlockContent }) => {

  const { data: allPaintings }: { data: RandomPaintingsQueryResult } = await sanityFetch({
    query: randomPaintingsQuery,
  });

  if (!allPaintings) {
    return null;
  }

  // Randomize the selection from the fetched pool
  const shuffledPaintings = shuffleArray(allPaintings).slice(0, 10);

  return (
    <>
    <div className="mb-12 px-4">
      <PortableText value={paintingsDescription as PortableTextBlock[]} />
    </div>
      <PaintingsCarousel 
        paintings={shuffledPaintings} 
      />
    </>
  );
};

export default PaintingsSection;
