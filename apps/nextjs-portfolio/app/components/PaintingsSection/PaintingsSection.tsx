'use client';
import { HomePageQueryResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import { Card } from '../Card/Card';
import Carousel from '../Carousel/Carousel';
import CustomPortableText from '../PortableText/PortableText';

import { type PortableTextBlock } from 'next-sanity';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';

type PaintingsSectionProps = {
  paintings?: NonNullable<HomePageQueryResult>['showcasePaintings'] | null;
  paintingsDescription?: PortableTextBlock[];
};

const PaintingsSection = ({ paintings, paintingsDescription }: PaintingsSectionProps) => {
  if (!paintings || paintings.length === 0) {
    return null;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const data = paintings.map(painting => ({
    categories: painting.tagsV2 || ['Art'],
    title: painting.title || '',
    href: `/paintings/${painting.slug}`,
    src: urlForImage(painting.image)?.height(1280).width(720).auto('format').url() || '',
  }));

  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className=""
    >
      <motion.div variants={itemVariants} className="px-4 text-text-primary">
        {paintingsDescription && (
          <CustomPortableText value={paintingsDescription} className="prose-invert" />
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Carousel items={cards} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center gap-4 text-text-primary"
      >
        <p>Like what you see?</p>
        <Link
          href="/paintings"
          className="px-4 py-2 text-on-primary transition-all duration-300 rounded-full bg-primary hover:bg-primary-light"
        >
          Explore all paintings
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default PaintingsSection;
