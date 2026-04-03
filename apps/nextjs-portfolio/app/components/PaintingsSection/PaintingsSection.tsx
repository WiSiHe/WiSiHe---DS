import type { BlockContent } from '@wisihe/sanity-queries';
import { PortableText, type PortableTextBlock } from 'next-sanity';
import { sanityFetch } from '@/sanity/lib/live';
import { randomPaintingsQuery } from '@/sanity/lib/queries';
import PaintingsCarousel from './PaintingsCarousel';
import PaintingsDesktopShowcase from './PaintingsDesktopShowcase';

const FEATURED_PAINTING_COUNT = 10;

/** Fisher–Yates shuffle (in-place copy). */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

const PaintingsSection = async ({
  paintingsDescription,
}: {
  paintingsDescription: BlockContent;
}) => {
  // NSFW exclusion is in GROQ: `randomPaintingsQuery` (packages/sanity-queries/src/index.ts).
  const { data: paintingsPool } = await sanityFetch({
    query: randomPaintingsQuery,
  });

  if (!paintingsPool?.length) {
    return null;
  }

  const featuredPaintings = shuffleArray(paintingsPool).slice(0, FEATURED_PAINTING_COUNT);

  return (
    <>
      <div className='mb-4 px-4 max-w-7xl mx-auto'>
        <div className='max-w-prose'>
          <PortableText value={paintingsDescription as PortableTextBlock[]} />
        </div>
      </div>
      <PaintingsCarousel paintings={featuredPaintings} />
      <PaintingsDesktopShowcase paintings={featuredPaintings} />
    </>
  );
};

export default PaintingsSection;
