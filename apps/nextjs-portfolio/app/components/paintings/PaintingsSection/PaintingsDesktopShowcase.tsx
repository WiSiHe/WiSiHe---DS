'use client';

import { IconBrandYoutube, IconMask, IconStack2 } from '@tabler/icons-react';
import { cleanTagName } from '@wisihe/utils';
import Link from 'next/link';
import { useMemo } from 'react';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import {
  paintingBrushSeed,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';
import { getCroppedAspectRatio } from '@/sanity/lib/utils';
import Masonry, { type MasonryItem } from './Masonry';

type PaintingsDesktopShowcaseProps = {
  // biome-ignore lint/suspicious/noExplicitAny: Painting data shape varies between Sanity and Algolia
  paintings: any[];
};

function masonryLogicalHeight(
  aspectRatio: number | null | undefined,
  id: string,
  index: number,
): number {
  const ar =
    typeof aspectRatio === 'number' && Number.isFinite(aspectRatio) && aspectRatio > 0.05
      ? aspectRatio
      : 1;
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
      const croppedAr = p.image ? getCroppedAspectRatio(p.image) : null;
      const height = masonryLogicalHeight(croppedAr ?? p.image?.aspectRatio ?? null, p._id, index);

      const layout = resolvePaintingCardLayout({
        format: p.format,
        aspectRatio: croppedAr ?? p.image?.aspectRatio ?? null,
      });
      const img = p.image ? urlForPaintingCard(p.image, layout, 85) : null;

      if (!img || !p.slug) return;

      const year = p.paintedAt ? new Date(p.paintedAt).getFullYear().toString() : undefined;
      const tags =
        p.tagsV2
          ?.map((t: { name?: string | null }) => cleanTagName(t.name ?? ''))
          .filter(Boolean) ?? [];

      const strokeIndex = paintingBrushSeed(p._id);
      const strokeColors = getBrushStrokeColors(strokeIndex, p.image?.palette ?? p.palette);

      const badges: MasonryItem['badges'] = [];
      if (p.isFanArt === true) {
        badges.push({
          key: 'fanart',
          icon: <IconMask className='size-4' stroke={2} aria-hidden />,
          label: 'Fan art',
        });
      }
      if (Number(p.images?.length ?? p.imagesCount ?? 0) > 0) {
        badges.push({
          key: 'multi',
          icon: <IconStack2 className='size-4' stroke={2} aria-hidden />,
          label: 'Multiple images',
        });
      }
      if (p.video) {
        badges.push({
          key: 'video',
          icon: <IconBrandYoutube className='size-4' stroke={2} aria-hidden />,
          label: 'Has video',
        });
      }

      out.push({
        id: p._id,
        img,
        lqip: p.image?.lqip ?? p.image?.asset?.lqip,
        url: `/paintings/${p.slug}`,
        height,
        title: p.title ?? undefined,
        strokeIndex,
        ...strokeColors,
        medium: p.medium ?? undefined,
        year,
        tags: tags.length > 0 ? tags : undefined,
        badges: badges.length > 0 ? badges : undefined,
        isNsfwBlurred: p.isNSFW === true,
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

      <div className='mt-16 flex flex-col items-center justify-center gap-4 text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4'>
        <p>Like what you see?</p>
        <Link
          href='/paintings'
          className='rounded-full bg-accent px-4 py-2 text-accent-contrast transition-all duration-300 hover:bg-accent-hover'
        >
          Explore all paintings
        </Link>
      </div>
    </section>
  );
};

export default PaintingsDesktopShowcase;
