'use client';

import { PaintingCardView, resolveNsfwCompactLabel } from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import { RouterLink } from '@/components/layout/RouterLink';
import { ContentMorphImageFrame } from '@/components/motion/ContentMorphImageFrame';
import Image from '@/components/ui/Image';
import { contentSlugLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
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
  layout?: 'default' | 'carousel';
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
  } = paintingData as {
    image?: Parameters<typeof urlForPaintingCard>[0] & {
      palette?: unknown;
      aspectRatio?: number | null;
    };
    title?: string;
    slug?: string | null;
    isNSFW?: boolean;
    tagsV2?: Array<{ name: string } | null> | null;
    format?: string | null;
    palette?: unknown;
    video?: string;
    imagesCount?: number;
    isFanArt?: boolean;
    paintedAt?: string | number | Date | null;
  };

  const cleanedTags = ((tagsV2?.filter(Boolean) ?? []) as { name: string }[]).map(t =>
    cleanTagName(t.name),
  );
  const layout = layoutProp ?? (disableBrushReveal ? 'carousel' : 'default');
  const cardImageLayout = resolvePaintingCardLayout({
    format,
    aspectRatio: image?.aspectRatio ?? null,
  });
  const morphLayoutId =
    layout !== 'carousel' && slug ? contentSlugLayoutId(String(slug)) : undefined;

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
      LinkComponent={RouterLink}
      ImageComponent={Image}
      imageLayoutId={morphLayoutId}
      ImageMorphFrame={ContentMorphImageFrame}
      imageLayoutTransition={sharedLayoutTransition}
      className={className ?? cardImageLayout.aspectClass}
    />
  );
}

export default function PaintingCard(props: PaintingCardAdapterProps) {
  if (!props.paintingData || Object.keys(props.paintingData).length === 0) return null;
  return <PaintingCardLoaded {...props} />;
}
