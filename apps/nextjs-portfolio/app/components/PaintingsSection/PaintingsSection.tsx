'use client';
import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { Card } from '../Card/Card';
import Carousel from '../Carousel/Carousel';
import CustomPortableText from '../PortableText/PortableText';

import { type PortableTextBlock } from 'next-sanity';
import Link from 'next/link';

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
        ?.height(1280)
        .width(720)
        .auto('format')
        .url() || '',
  }));

  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  return (
    <section className="z-10 py-8 pl-4 pointer-events-none lg:pl-8">
      <div className="px-4 text-white">
        <CustomPortableText
          value={paintingsDescription}
          className="prose-invert"
        />
      </div>
      <Carousel items={cards} />

      <div className="flex flex-col items-center justify-center gap-4 text-white">
        <p>Like what you see?</p>
        <Link
          href="/paintings"
          className="px-4 py-2 rounded-sm pointer-events-auto bg-primary"
        >
          View All Paintings
        </Link>
      </div>
    </section>
  );
};

export default PaintingsSection;
