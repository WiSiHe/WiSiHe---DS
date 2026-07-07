'use client';

import { PaintingCardView } from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { contentImageLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import { resolveNsfwCompactLabel } from '@/lib/paintings/nsfwCover';
import {
  getPaintingImageLqip,
  resolvePaintingCardLayout,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';
import { buildPaintingCardBadges, parsePaintingYear } from '@/lib/paintings/paintingCardProps';

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
  /** Carousel / touch — caption below image. */
  layout?: 'default' | 'carousel';
  /** @deprecated Use `layout="carousel"` */
  disableBrushReveal?: boolean;
  brushHovered?: boolean;
  className?: string;
};

function PaintingCardLoaded({
  paintingData,
  shouldBeLazy = false,
  isNsfwFilterActive = false,
  svgHoverIndex,
  layout: layoutProp,
  disableBrushReveal = false,
  brushHovered,
  className,
}: PaintingCardAdapterProps) {
  const {
    image,
    title = '',
    slug,
    isNSFW,
    tagsV2,
    format,
    palette,
    video = '',
    imagesCount = 0,
    isFanArt,
    paintedAt,
    // biome-ignore lint/suspicious/noExplicitAny: Sanity / Algolia hit shape varies by query
  } = paintingData as any;

  const cleanedTags = ((tagsV2?.filter(Boolean) ?? []) as { name: string }[]).map(t =>
    cleanTagName(t.name),
  );
  const layout = layoutProp ?? (disableBrushReveal ? 'carousel' : 'default');
  const cardImageLayout = resolvePaintingCardLayout({
    format,
    aspectRatio: image?.aspectRatio ?? null,
  });

  return (
    <PaintingCardView
      title={title}
      href={`/paintings/${slug ?? ''}`}
      imageSrc={urlForPaintingCard(image, cardImageLayout)}
      imageAlt={title || 'Painting'}
      blurDataURL={getPaintingImageLqip(image)}
      imagePriority={shouldBeLazy}
      badges={buildPaintingCardBadges({ isFanArt, imagesCount, video })}
      tags={cleanedTags}
      format={format}
      aspectRatio={image?.aspectRatio ?? null}
      isNsfw={isNSFW === true}
      isNsfwVisible={isNsfwFilterActive}
      matureContentLabel={resolveNsfwCompactLabel(cleanedTags)}
      paintedAt={parsePaintingYear(paintedAt)}
      layout={layout}
      brushReveal={layout !== 'carousel'}
      brushHovered={brushHovered}
      brushSeedKey={String(paintingData._id ?? slug ?? title ?? 'painting')}
      strokeVariantIndex={svgHoverIndex}
      palette={palette ?? image?.palette ?? null}
      LinkComponent={Link}
      ImageComponent={Image}
      imageLayoutId={layout !== 'carousel' && slug ? contentImageLayoutId(slug) : undefined}
      imageLayoutTransition={sharedLayoutTransition}
      className={className ?? cardImageLayout.aspectClass}
    />
  );
}

export default function PaintingCard(props: PaintingCardAdapterProps) {
  if (!props.paintingData || Object.keys(props.paintingData).length === 0) return null;
  return <PaintingCardLoaded {...props} />;
}
