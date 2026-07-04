import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import HomePaintingsSectionAnalytics from '@/app/components/analytics/HomePaintingsSectionAnalytics';
import type { HomePaintingsSection } from '@/lib/homePageBuilder';
import PaintingsShowcase from './PaintingsShowcase';

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
      <PaintingsShowcase
        paintings={featuredPaintings}
        intro={<PortableText value={paintingsDescription as PortableTextBlock[]} />}
      />
    </>
  );
};

export default PaintingsSection;
