'use client';
import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { Card } from '../Card/Card';
import Carousel from '../Carousel/Carousel';
import CustomPortableText from '../PortableText/PortableText';

import { type PortableTextBlock } from 'next-sanity';

type PaintingsSectionProps = {
  paintings: NonNullable<HomePageQueryResult>['showcasePaintings'];
  paintingsDescription: PortableTextBlock[];
};

const PaintingsSection = ({
  paintings,
  paintingsDescription,
}: PaintingsSectionProps) => {
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
    <section className="">
      <div className="px-4">
        <CustomPortableText
          value={paintingsDescription}
          className="prose-invert"
        />
      </div>
      <Carousel items={cards} />

      <div className="flex justify-center text-white">
        <p>Like what you see?</p>
        <button className="btn btn-primary">View All</button>
      </div>
    </section>
  );
};

export default PaintingsSection;
