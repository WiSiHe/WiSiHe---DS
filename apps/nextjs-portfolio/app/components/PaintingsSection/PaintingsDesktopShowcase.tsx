'use client';

import type { RandomPaintingsQueryResult } from '@wisihe/sanity-queries';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

import Masonry, { type MasonryItem } from './Masonry';

type PaintingsDesktopShowcaseProps = {
  paintings: RandomPaintingsQueryResult;
};

const PaintingsDesktopShowcase = ({ paintings }: PaintingsDesktopShowcaseProps) => {
  const items = useMemo<MasonryItem[]>(() => {
    if (!paintings?.length) return [];
    const out: MasonryItem[] = [];
    paintings.forEach((p, index) => {
      const ar =
        typeof p.image?.aspectRatio === 'number' && Number.isFinite(p.image.aspectRatio)
          ? p.image.aspectRatio
          : 1;
      const base = 320 + (index % 5) * 48;
      const height = Math.round(base * (ar >= 1 ? 1 : 1.12));
      const img = p.image
        ? urlForImage(p.image)?.width(900).height(1200).quality(85).auto('format').url()
        : null;
      if (!img || !p.slug) return;
      out.push({
        id: p._id,
        img,
        url: `/paintings/${p.slug}`,
        height,
        title: p.title ?? undefined,
      });
    });
    return out;
  }, [paintings]);

  if (!items.length) {
    return null;
  }

  return (
    <section className='hidden md:block' aria-label='Featured paintings gallery'>
      <div className='mx-auto max-w-7xl'>
        <Masonry
          items={items}
          ease='power3.out'
          duration={0.6}
          stagger={0.05}
          animateFrom='bottom'
          scaleOnHover
          hoverScale={0.97}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className='mt-16 flex flex-col items-center justify-center gap-4 text-foreground'
      >
        <p>Like what you see?</p>
        <Link
          href='/paintings'
          className='rounded-full bg-accent px-4 py-2 text-accent-contrast transition-all duration-300 hover:bg-accent-hover'
        >
          Explore all paintings
        </Link>
      </motion.div>
    </section>
  );
};

export default PaintingsDesktopShowcase;
