'use client';

import { PaintingCard, type PaintingCardBadge } from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { BsYoutube } from 'react-icons/bs';
import { TbBoxMultiple, TbMasksTheater } from 'react-icons/tb';
import {
  getHeroStrokeColors,
  HeroPaintingSvgHover,
} from '@/app/components/marketing/HeroSection/HeroPaintingSvgHover';
import { urlForImage } from '@/sanity/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

// Loose type so this adapter works with both Sanity GROQ results and Algolia hits
// (avoids brittle dependency on generated types that resolve to `never` when typegen fails)
type PaintingData = Record<string, unknown> & {
  _id?: string;
  slug?: string | null;
  title?: string;
};

type PaintingCardAdapterProps = {
  paintingData: PaintingData;
  shouldBeLazy?: boolean;
  /** Set true when the user has actively filtered for NSFW in InstantSearch */
  isNsfwFilterActive?: boolean;
  /** When set, brush-stroke SVG hover (home hero) is drawn over the image; pair with `PaintingCardSvgHoverWrap`. */
  svgHoverIndex?: number;
  /** Tags + title strip stay visible without hover (e.g. touch / mobile carousel). */
  alwaysShowTags?: boolean;
  /** Passed through to PaintingCard — use to override aspect ratio via tailwind-merge */
  className?: string;
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
  className,
}: PaintingCardAdapterProps) => {
  if (!paintingData || Object.keys(paintingData).length === 0) return null;

  // biome-ignore lint/suspicious/noExplicitAny: Sanity result shape varies by query
  const {
    image,
    title = '',
    video = '',
    imagesCount = 0,
    slug,
    isFanArt,
    isNSFW,
    isForSale,
    hasStoreLink,
    redbubbleUrl,
    gelatoUrl,
    tagsV2,
    medium,
    paintedAt,
  } = paintingData as any;

  const availableForSale =
    isForSale === true || hasStoreLink === true || Boolean(redbubbleUrl || gelatoUrl);

  // Extract year from paintedAt date string safely
  let yearString: string | undefined;
  if (paintedAt) {
    if (typeof paintedAt === 'string') {
      if (paintedAt.includes('-')) {
        const d = new Date(paintedAt);
        if (!isNaN(d.getTime())) {
          yearString = d.getFullYear().toString();
        }
      } else {
        yearString = paintedAt;
      }
    } else if (typeof paintedAt === 'number') {
      yearString = paintedAt.toString();
    } else if (paintedAt instanceof Date) {
      yearString = paintedAt.getFullYear().toString();
    }
  }

  const filteredTags = (tagsV2?.filter(Boolean) ?? []) as { name: string }[];
  const cleanedTags = filteredTags.map(t => cleanTagName(t.name));

  const isNsfw = isNSFW === true;

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

  // Secondary badges — reveal on hover only (no pinned featured / NSFW icons).
  const badges: PaintingCardBadge[] = [];
  if (isFanArt === true) {
    badges.push({
      key: 'fanart',
      icon: <TbMasksTheater className='w-4 h-4' />,
      label: 'Fan art',
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
      isForSale={availableForSale}
      badges={badges}
      alwaysShowTags={alwaysShowTags}
      className={className}
      medium={medium}
      paintedAt={yearString}
    />
  );
};

export default PaintingCardAdapter;
