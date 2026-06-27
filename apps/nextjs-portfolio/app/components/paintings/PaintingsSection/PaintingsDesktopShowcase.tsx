'use client';

import { cleanTagName } from '@wisihe/utils';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { paintingBrushSeed } from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import { getCroppedAspectRatio, urlForImage } from '@/sanity/lib/utils';
import Masonry, { type MasonryItem } from './Masonry';

type PaintingsDesktopShowcaseProps = {
  // biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
  paintings: any[];
};

/**
 * Logical height for masonry packing (`Masonry` uses `height / 2` as the rendered row height).
 * Uses Sanity `aspectRatio` (width ÷ height): portraits get taller tiles, landscapes shorter,
 * with a stable per-id jitter and occasional “hero” emphasis so the grid feels less uniform.
 */
function masonryLogicalHeight(
  aspectRatio: number | null | undefined,
  id: string,
  index: number,
): number {
  const ar =
    typeof aspectRatio === 'number' && Number.isFinite(aspectRatio) && aspectRatio > 0.05
      ? aspectRatio
      : 1;
  /** Taller when image is portrait-ish, shorter when landscape-ish */
  const tallness = 1 / ar;
  let salt = 0;
  for (let i = 0; i < id.length; i++) {
    salt = (salt * 31 + id.charCodeAt(i)) | 0;
  }
  const jitter = 0.92 + (Math.abs(salt) % 17) / 100;
  const hero = index % 6 === 0 ? 1.14 : index % 4 === 1 ? 0.9 : 1;
  const base = 340;
  const spread = 420;
  return Math.round(base + tallness * spread * jitter * hero);
}

const PaintingsDesktopShowcase = ({ paintings }: PaintingsDesktopShowcaseProps) => {
  const items = useMemo<MasonryItem[]>(() => {
    if (!paintings?.length) return [];
    const out: MasonryItem[] = [];
    paintings.forEach((p, index) => {
      const croppedAr = getCroppedAspectRatio(p.image);
      const height = masonryLogicalHeight(croppedAr, p._id, index);
      const width = 900;
      const heightPx = Math.round(width / croppedAr);
      const img = p.image
        ? urlForImage(p.image)
            ?.width(width)
            .height(heightPx)
            .fit('crop')
            .quality(85)
            .auto('format')
            .url()
        : null;
      if (!img || !p.slug) return;

      const year = p.paintedAt ? new Date(p.paintedAt).getFullYear().toString() : undefined;

      const tags =
        p.tagsV2
          ?.map((t: { name?: string | null }) => cleanTagName(t.name ?? ''))
          .filter(Boolean) ?? [];

      out.push({
        id: p._id,
        img,
        url: `/paintings/${p.slug}`,
        height,
        title: p.title ?? undefined,
        strokeIndex: paintingBrushSeed(p._id),
        medium: p.medium ?? undefined,
        year,
        tags: tags.length > 0 ? tags : undefined,
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
