'use client';
import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { Card } from '../Card/Card';
import Carousel from '../Carousel/Carousel';

type PaintingsSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'];
};

const PaintingsSection = ({ paintings }: PaintingsSectionProps) => {
  if (!paintings || paintings.length === 0) {
    return null;
  }

  const data = paintings.map((painting) => ({
    categories: painting.tagsV2 || ['Art'],
    title: painting.title || '',
    href: `/paintings/${painting.slug}`,
    src:
      urlForImage(painting.image)
        ?.height(720)
        .width(1280)
        .auto('format')
        .url() || '',
  }));

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  return (
    <section className="paintings-section">
      <Carousel items={cards} />
    </section>
  );
};

export default PaintingsSection;
