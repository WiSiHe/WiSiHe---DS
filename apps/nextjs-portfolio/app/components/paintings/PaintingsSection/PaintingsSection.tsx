import type { BlockContentMinimal } from '@wisihe/sanity-queries';
import { SectionHeader } from '@wisihe/ui-react';
import type { PortableTextBlock } from 'next-sanity';
import { PortableText } from 'next-sanity';
import HomePaintingsSectionAnalytics from '@/app/components/analytics/HomePaintingsSectionAnalytics';
import type { HomePaintingsSection } from '@/lib/homePageBuilder';
import PaintingsShowcase from './PaintingsShowcase';

const FEATURED_PAINTING_COUNT = 10;
const PAINTINGS_EYEBROW = '// Gallery';
const PAINTINGS_TITLE = 'Featured paintings';

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

  const descriptionContent = paintingsDescription?.length ? (
    <PortableText value={paintingsDescription as PortableTextBlock[]} />
  ) : undefined;

  return (
    <>
      <HomePaintingsSectionAnalytics
        paintingCount={featuredPaintings.length}
        source={paintingsSource}
      />
      <div className='mx-auto mb-10 max-w-7xl md:mb-12'>
        <SectionHeader
          align='left'
          eyebrow={PAINTINGS_EYEBROW}
          title={PAINTINGS_TITLE}
          headingId='home-paintings-heading'
          description={descriptionContent}
        />
      </div>
      <PaintingsShowcase paintings={featuredPaintings} />
    </>
  );
};

export default PaintingsSection;
