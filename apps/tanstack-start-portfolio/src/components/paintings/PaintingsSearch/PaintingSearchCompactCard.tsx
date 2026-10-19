'use client';

import {
  type BrushPalette,
  getBrushStrokeColors,
  NSFW_MATURE_LABEL,
  type PaintingThumbnailImageComponentProps,
  PaintingThumbnailView,
  resolveNsfwCompactLabel,
  resolveNsfwRatingLabel,
} from '@wisihe/ui-react';
import { cleanTagName } from '@wisihe/utils';
import { memo, useMemo } from 'react';
import { RouterLink } from '@/components/layout/RouterLink';
import { ContentMorphImageFrame } from '@/components/motion/ContentMorphImageFrame';
import Image from '@/components/ui/Image';
import { contentSlugLayoutId, sharedLayoutTransition } from '@/lib/motion/sharedLayout';
import {
  getPaintingImageLqip,
  type PaintingCardAspectLayout,
  paintingBrushSeed,
  resolvePaintingCardLayout,
  srcSetForPaintingCard,
  urlForPaintingCard,
} from '@/lib/paintings/paintingCardImage';

const searchCompactImageUrlCache = new Map<string, string>();

type PaintingImage = {
  aspectRatio?: number | null;
  asset?: { _ref?: string; lqip?: string };
  lqip?: string;
  hotspot?: unknown;
  crop?: unknown;
};

type PaintingSearchCompactCardProps = {
  title: string;
  slug: string;
  image?: PaintingImage | null;
  index: number;
  format?: string | null;
  isNsfw?: boolean;
  isNsfwFilterActive?: boolean;
  isForSale?: boolean;
  hasStoreLink?: boolean;
  paintingId?: string;
  tags?: string[];
  palette?: BrushPalette | null;
};

function getSearchCompactImageUrl(
  image: PaintingImage | null | undefined,
  layout: PaintingCardAspectLayout,
): string | null {
  const ref = image?.asset?._ref;
  if (!ref) return null;

  const cacheKey = `${ref}:${layout.format}`;
  const cached = searchCompactImageUrlCache.get(cacheKey);
  if (cached) return cached;

  const url = urlForPaintingCard(image as Parameters<typeof urlForPaintingCard>[0], layout);
  if (url) searchCompactImageUrlCache.set(cacheKey, url);
  return url ?? null;
}

function PaintingThumbnailImage(props: PaintingThumbnailImageComponentProps) {
  return <Image {...props} />;
}

function PaintingSearchCompactCardInner({
  title,
  slug,
  image,
  index,
  format,
  isNsfw = false,
  isNsfwFilterActive = false,
  isForSale = false,
  hasStoreLink = false,
  paintingId,
  tags = [],
  palette,
}: PaintingSearchCompactCardProps) {
  const displayTitle = title.trim() || 'Untitled painting';
  const showNsfwCover = isNsfw && !isNsfwFilterActive;
  const availableForSale = isForSale || hasStoreLink;
  const layout = useMemo(
    () =>
      resolvePaintingCardLayout({
        format,
        aspectRatio: image?.aspectRatio ?? null,
      }),
    [format, image?.aspectRatio],
  );
  const imageSrc = getSearchCompactImageUrl(image, layout);
  const imageSrcSet = srcSetForPaintingCard(
    image as Parameters<typeof srcSetForPaintingCard>[0],
    layout,
  );
  const lqip = getPaintingImageLqip(image as Parameters<typeof getPaintingImageLqip>[0]);
  const brushSeed = paintingBrushSeed(paintingId ?? slug ?? title);
  const strokeColors = getBrushStrokeColors(brushSeed, palette ?? undefined);
  const cleanedTags = useMemo(() => tags.map(tag => cleanTagName(tag)).filter(Boolean), [tags]);
  const nsfwLabel = resolveNsfwRatingLabel(cleanedTags);
  const nsfwCompactLabel = resolveNsfwCompactLabel(cleanedTags);

  return (
    <PaintingThumbnailView
      title={displayTitle}
      href={`/paintings/${slug}`}
      imageSrc={imageSrc}
      imageSrcSet={imageSrcSet}
      blurDataURL={lqip}
      aspectClass={layout.aspectClass}
      priority={index < 4}
      eager={index < 4}
      showNsfwCover={showNsfwCover}
      nsfwCompactLabel={nsfwCompactLabel}
      nsfwScreenReaderLabel={nsfwLabel === NSFW_MATURE_LABEL ? NSFW_MATURE_LABEL : nsfwLabel}
      strokeColors={strokeColors}
      strokeVariantIndex={brushSeed}
      revealSeed={brushSeed}
      paintingFormat={layout.format}
      brushReveal
      paintedAt={null}
      availableForSale={availableForSale}
      LinkComponent={RouterLink}
      ImageComponent={PaintingThumbnailImage}
      imageLayoutId={slug ? contentSlugLayoutId(slug) : undefined}
      ImageMorphFrame={ContentMorphImageFrame}
      imageLayoutTransition={sharedLayoutTransition}
    />
  );
}

export const PaintingSearchCompactCard = memo(
  PaintingSearchCompactCardInner,
  (prev, next) =>
    prev.slug === next.slug &&
    prev.title === next.title &&
    prev.index === next.index &&
    prev.format === next.format &&
    prev.isNsfw === next.isNsfw &&
    prev.isNsfwFilterActive === next.isNsfwFilterActive &&
    prev.isForSale === next.isForSale &&
    prev.hasStoreLink === next.hasStoreLink &&
    prev.paintingId === next.paintingId &&
    prev.tags === next.tags &&
    prev.image?.asset?._ref === next.image?.asset?._ref &&
    prev.image?.aspectRatio === next.image?.aspectRatio,
);
