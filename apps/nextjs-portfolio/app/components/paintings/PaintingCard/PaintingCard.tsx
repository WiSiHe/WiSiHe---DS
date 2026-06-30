'use client';

import { IconBrandYoutube, IconMask, IconStack2 } from '@tabler/icons-react';
import { PaintingCard, type PaintingCardBadge } from '@wisihe/ui-react';
import { cleanTagName, cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { BrushRevealLayer } from '@/app/components/paintings/BrushReveal/BrushRevealLayer';
import { BrushRevealWrap } from '@/app/components/paintings/BrushReveal/BrushRevealWrap';
import { NsfwBrushCover } from '@/app/components/paintings/BrushReveal/NsfwBrushCover';
import { getBrushStrokeColors } from '@/lib/paintings/brushStrokeColors';
import { useCanBrushReveal } from '@/lib/paintings/mediaCapabilities';
import { NSFW_IMAGE_BLUR_CLASS } from '@/lib/paintings/nsfwCover';
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

type PaintingCardInnerProps = {
  paintingData: PaintingData;
  shouldBeLazy?: boolean;
  isNsfwFilterActive?: boolean;
  svgHoverIndex?: number;
  alwaysShowTags?: boolean;
  canBrushReveal: boolean;
  className?: string;
};

function PaintingCardInner({
  paintingData,
  shouldBeLazy = false,
  isNsfwFilterActive = false,
  svgHoverIndex,
  alwaysShowTags = false,
  canBrushReveal,
  className,
}: PaintingCardInnerProps) {
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
      className={cn('object-cover w-full h-full', showNsfwBlur && NSFW_IMAGE_BLUR_CLASS)}
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
      icon: <IconMask className='size-4' stroke={2} aria-hidden />,
      label: 'Fan art',
    });
  }
  if (Number(imagesCount) > 0) {
    badges.push({
      key: 'multi',
      icon: <IconStack2 className='size-4' stroke={2} aria-hidden />,
      label: 'Multiple images',
    });
  }
  if (video) {
    badges.push({
      key: 'video',
      icon: <IconBrandYoutube className='size-4' stroke={2} aria-hidden />,
      label: 'Has video',
    });
  }

  const showTagsWithoutBrush = alwaysShowTags || !canBrushReveal;

  const imageNode = imageEl ? (
    <div className='relative isolate h-full w-full overflow-hidden rounded-xl'>
      {imageEl}
      {showNsfwBlur ? <NsfwBrushCover {...strokeColors} strokeVariantIndex={brushIndex} /> : null}
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
}

type PaintingCardAdapterProps = {
  paintingData: PaintingData;
  shouldBeLazy?: boolean;
  isNsfwFilterActive?: boolean;
  svgHoverIndex?: number;
  alwaysShowTags?: boolean;
  /** Carousel / touch layouts — skip SVG brush reveal even on fine-pointer devices */
  disableBrushReveal?: boolean;
  className?: string;
};

function PaintingCardWithDeviceBrush(props: Omit<PaintingCardAdapterProps, 'disableBrushReveal'>) {
  const canBrushReveal = useCanBrushReveal();
  return <PaintingCardInner {...props} canBrushReveal={canBrushReveal} />;
}

const PaintingCardAdapter = ({
  disableBrushReveal = false,
  ...props
}: PaintingCardAdapterProps) => {
  if (disableBrushReveal) {
    return <PaintingCardInner {...props} canBrushReveal={false} />;
  }
  return <PaintingCardWithDeviceBrush {...props} />;
};

export default PaintingCardAdapter;
