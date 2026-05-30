import type { BlockContent, RandomPaintingsQueryResult } from '@wisihe/sanity-queries';
import { shuffleArray } from '@wisihe/utils';
import { PortableText, type PortableTextBlock } from 'next-sanity';
import { sanityFetch } from '@/sanity/lib/live';
import { randomPaintingsQuery } from '@/sanity/lib/queries';
import PaintingsCarousel from './PaintingsCarousel';
import PaintingsDesktopShowcase from './PaintingsDesktopShowcase';

const FEATURED_PAINTING_COUNT = 10;

const PaintingsSection = async ({
  paintingsDescription,
}: {
  paintingsDescription: BlockContent;
}) => {
  // NSFW exclusion is in GROQ: `randomPaintingsQuery` (packages/sanity-queries/src/index.ts).
  const { data } = await sanityFetch({
    query: randomPaintingsQuery,
  });
  const paintingsPool = data as RandomPaintingsQueryResult;

  if (!paintingsPool?.length) {
    return null;
  }

  const featuredPaintings = shuffleArray(paintingsPool).slice(
    0,
    FEATURED_PAINTING_COUNT,
  ) as RandomPaintingsQueryResult;

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
