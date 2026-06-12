'use client';

import { IconArrowRight } from '@tabler/icons-react';
import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PaintingCard from '@/app/components/paintings/PaintingCard/PaintingCard';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import HomeSectionHeader from '../HomeSectionHeader/HomeSectionHeader';

type PaintingItem = NonNullable<HomeExtrasQueryResult>['forSalePaintings'][number];

const DEFAULT_COPY = {
  eyebrow: '// Shop',
  title: 'Available as prints',
  description:
    'Selected works available through print-on-demand — take a piece of the gallery home.',
  linkLabel: 'Browse gallery',
};

type ShopTeaserSectionProps = {
  intro: HomeSectionIntroCopy | null | undefined;
  paintings: PaintingItem[];
};

export default function ShopTeaserSection({ intro, paintings }: ShopTeaserSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

  if (paintings.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);

  return (
    <section
      className='border-t border-border/20 bg-background py-24 px-4 md:px-8'
      aria-labelledby='shop-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between'>
          <HomeSectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            headingId='shop-teaser-heading'
            align='left'
          />
          <Button
            as={Link}
            href='/paintings'
            variant='secondary'
            size='medium'
            Icon={IconArrowRight}
            iconPosition='right'
            className='shrink-0 rounded-full'
          >
            {copy.linkLabel}
          </Button>
        </div>

        <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {paintings.map((painting, index) => (
            <motion.li
              key={painting._id}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <PaintingCard paintingData={painting} shouldBeLazy alwaysShowTags />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
