import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import HomePaintingsSectionAnalytics from '@/app/components/analytics/HomePaintingsSectionAnalytics';
import type { HomePaintingsSection } from '@/lib/homePageBuilder';
import PaintingsCarousel from './PaintingsCarousel';
import PaintingsDesktopShowcase from './PaintingsDesktopShowcase';

const FEATURED_PAINTING_COUNT = 10;

type ShowcasePainting = NonNullable<HomePaintingsSection['showcasePaintings']>[number];

const PaintingsSection = ({
  paintingsDescription,
  showcasePaintings,
  paintingsSource = 'cms_showcase',
}: {
  paintingsDescription: BlockContentMinimal | null | undefined;
  showcasePaintings: ShowcasePainting[] | null | undefined;
  paintingsSource?: 'cms_showcase' | 'featured_fallback';
}) => {
  const featuredPaintings = (showcasePaintings ?? [])
    .filter(painting => painting.isNSFW !== true)
    .slice(0, FEATURED_PAINTING_COUNT);

  if (!featuredPaintings.length) {
    return null;
  }

  return (
    <>
      <HomePaintingsSectionAnalytics
        paintingCount={featuredPaintings.length}
        source={paintingsSource}
      />
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
