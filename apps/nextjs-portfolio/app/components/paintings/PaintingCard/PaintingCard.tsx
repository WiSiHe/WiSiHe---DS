'use client';

import type { GetAllPaintingsandTagsResult } from '@wisihe/sanity-queries';
import { PaintingCard, type PaintingCardBadge } from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { BsYoutube } from 'react-icons/bs';
import { FaExclamation, FaShoppingCart } from 'react-icons/fa';
import { TbBoxMultiple } from 'react-icons/tb';
import {
  getHeroStrokeColors,
  HeroPaintingSvgHover,
} from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import { urlForImage } from '@/sanity/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type PaintingCardAdapterProps = {
  paintingData: GetAllPaintingsandTagsResult['paintings'][0];
  shouldBeLazy?: boolean;
  /** Set true when the user has actively filtered for NSFW in InstantSearch */
  isNsfwFilterActive?: boolean;
  /** When set, brush-stroke SVG hover (home hero) is drawn over the image; pair with `PaintingCardSvgHoverWrap`. */
  svgHoverIndex?: number;
  /** Tags + title strip stay visible without hover (e.g. touch / mobile carousel). */
  alwaysShowTags?: boolean;
};

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

const PaintingCardAdapter = ({
  paintingData,
  shouldBeLazy = false,
  isNsfwFilterActive = false,
  svgHoverIndex,
  alwaysShowTags = false,
}: PaintingCardAdapterProps) => {
  if (!paintingData || Object.keys(paintingData).length === 0) return null;

  // biome-ignore lint/suspicious/noExplicitAny: Sanity result shape varies by query
  const { image, title = '', video = '', imagesCount = 0, slug } = paintingData as any;
  const { tagsV2 } = paintingData;

  const filteredTags = (tagsV2?.filter(Boolean) ?? []) as { name: string }[];
  const cleanedTags = filteredTags.map(t => cleanTagName(t.name));

  const hasStore = cleanedTags.includes('Store');
  const isNsfw = cleanedTags.includes('NSFW');

  // urlForImage needs asset._ref — the Algolia sync now stores it correctly.
  const imageSrc = image
    ? urlForImage(image)?.width(800).height(1066).quality(80).auto('format').url()
    : null;

  const imageEl = imageSrc ? (
    <Image
      src={imageSrc}
      alt={title || 'Painting'}
      fill
      sizes='(min-width: 1040px) 20vw, 50vw'
      priority={shouldBeLazy}
      fetchPriority={shouldBeLazy ? 'high' : 'auto'}
      placeholder={image?.lqip ? 'blur' : 'empty'}
      blurDataURL={image?.lqip ?? undefined}
      quality={80}
      className='object-cover w-full h-full'
    />
  ) : undefined;

  // Build the image ReactNode that will be passed to the generic card
  const imageNode =
    imageEl && svgHoverIndex !== undefined ? (
      <div className='relative isolate h-full w-full overflow-hidden rounded-xl'>
        {imageEl}
        <HeroPaintingSvgHover {...getHeroStrokeColors(svgHoverIndex)} title={title || null} />
      </div>
    ) : (
      imageEl
    );

  // Build the badges array
  const badges: PaintingCardBadge[] = [];
  if (hasStore) {
    badges.push({
      key: 'store',
      icon: <FaShoppingCart className='w-4 h-4' />,
      label: 'Available for sale',
    });
  }
  if (Number(imagesCount) > 0) {
    badges.push({
      key: 'multi',
      icon: <TbBoxMultiple className='w-4 h-4' />,
      label: 'Multiple images',
    });
  }
  if (video) {
    badges.push({ key: 'video', icon: <BsYoutube className='w-4 h-4' />, label: 'Has video' });
  }
  if (isNsfw) {
    badges.push({
      key: 'nsfw',
      icon: <FaExclamation className='w-4 h-4' />,
      label: 'NSFW content',
    });
  }

  const normalized = slug ?? '';

  return (
    <PaintingCard
      title={title}
      href={`/paintings/${normalized}`}
      LinkComponent={Link}
      image={imageNode}
      tags={cleanedTags}
      isNsfw={isNsfw}
      isNsfwVisible={isNsfwFilterActive}
      badges={badges}
      alwaysShowTags={alwaysShowTags}
    />
  );
};

export default PaintingCardAdapter;
