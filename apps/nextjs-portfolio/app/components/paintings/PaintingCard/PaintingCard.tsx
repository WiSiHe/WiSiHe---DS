'use client';

import { PaintingCard, type PaintingCardBadge } from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { BsYoutube } from 'react-icons/bs';
import { TbBoxMultiple, TbMasksTheater } from 'react-icons/tb';
import { BrushRevealLayer } from '@/app/components/paintings/BrushReveal/BrushRevealLayer';
import { BrushRevealWrap } from '@/app/components/paintings/BrushReveal/BrushRevealWrap';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { useCanBrushReveal } from '@/lib/paintings/mediaCapabilities';
import {
  getPaintingImageLqip,
  paintingBrushSeed,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

type PaintingData = Record<string, unknown> & {
  _id?: string;
  slug?: string | null;
  title?: string;
};

type PaintingCardAdapterProps = {
  paintingData: PaintingData;
  shouldBeLazy?: boolean;
  isNsfwFilterActive?: boolean;
  svgHoverIndex?: number;
  alwaysShowTags?: boolean;
  className?: string;
};

const PaintingCardAdapter = ({
  paintingData,
  shouldBeLazy = false,
  isNsfwFilterActive = false,
  svgHoverIndex,
  alwaysShowTags = false,
  className,
}: PaintingCardAdapterProps) => {
  const canBrushReveal = useCanBrushReveal();

  if (!paintingData || Object.keys(paintingData).length === 0) return null;

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
    format,
    palette,
    // biome-ignore lint/suspicious/noExplicitAny: Sanity / Algolia hit shape varies by query
  } = paintingData as any;

  const availableForSale =
    isForSale === true || hasStoreLink === true || Boolean(redbubbleUrl || gelatoUrl);

  let yearString: string | undefined;
  if (paintedAt) {
    if (typeof paintedAt === 'string') {
      if (paintedAt.includes('-')) {
        const d = new Date(paintedAt);
        if (!Number.isNaN(d.getTime())) {
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
  const showNsfwBlur = isNsfw && !isNsfwFilterActive;
  const brushTags = showNsfwBlur
    ? cleanedTags.filter(tag => !/^nsfw$/i.test(tag.trim()))
    : cleanedTags;

  const layout = resolvePaintingCardLayout({
    format,
    aspectRatio: image?.aspectRatio ?? null,
  });

  const imageSrc = urlForPaintingCard(image, layout);
  const lqip = getPaintingImageLqip(image);

  const imageEl = imageSrc ? (
    <Image
      src={imageSrc}
      alt={title || 'Painting'}
      fill
      sizes='(min-width: 1040px) 20vw, 50vw'
      priority={shouldBeLazy}
      fetchPriority={shouldBeLazy ? 'high' : 'auto'}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      quality={80}
      className='object-cover w-full h-full'
    />
  ) : undefined;

  const brushSeed = paintingBrushSeed(String(paintingData._id ?? slug ?? title ?? 'painting'));
  const brushIndex = svgHoverIndex ?? brushSeed;
  const strokeColors = getBrushStrokeColors(brushIndex, palette ?? image?.palette);
  const normalized = slug ?? '';

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

  const showTagsWithoutBrush = alwaysShowTags || !canBrushReveal;

  const imageNode = imageEl ? (
    <div className='relative isolate h-full w-full overflow-hidden rounded-xl'>
      {imageEl}
      {showNsfwBlur ? (
        <div
          data-nsfw-blur
          className='pointer-events-none absolute inset-0 z-[8] bg-background/45 backdrop-blur-xl'
          aria-hidden
        />
      ) : null}
      {canBrushReveal ? (
        <BrushRevealLayer
          {...strokeColors}
          strokeVariantIndex={brushIndex}
          title={title || null}
          medium={medium ?? null}
          year={yearString ?? null}
          tags={brushTags}
          badges={badges}
          isNsfwBlurred={showNsfwBlur}
        />
      ) : null}
    </div>
  ) : undefined;

  const card = (
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
      alwaysShowTags={showTagsWithoutBrush}
      brushReveal={canBrushReveal}
      className={className ?? layout.aspectClass}
      medium={medium}
      paintedAt={yearString}
    />
  );

  if (!imageEl || !canBrushReveal) {
    return card;
  }

  return <BrushRevealWrap>{card}</BrushRevealWrap>;
};

export default PaintingCardAdapter;
