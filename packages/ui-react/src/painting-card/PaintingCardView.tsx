'use client';

import { cn } from '@wisihe/utils';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import type * as React from 'react';
import { BrushRevealLayer } from './brush-reveal/BrushRevealLayer';
import { BrushRevealWrap } from './brush-reveal/BrushRevealWrap';
import { type BrushPalette, getBrushStrokeColors } from './brush-stroke/brushStrokeColors';
import { paintingBrushSeed } from './brush-stroke/brushStrokeVariants';
import { resolvePaintingCardLayout } from './layout';
import type { ContentMorphFrameComponent } from './morphFrame';
import { getNsfwImageBlurClass, NSFW_COMPACT_LABEL } from './nsfwCover';
import { PaintingCard, type PaintingCardBadge, type PaintingCardLayout } from './PaintingCard';

export type PaintingCardImageComponentProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
};

export type PaintingCardViewProps = {
  title: string;
  href: string;
  imageSrc?: string | null;
  imageAlt?: string;
  blurDataURL?: string;
  imagePriority?: boolean;
  tags?: string[];
  badges?: PaintingCardBadge[];
  format?: string | null;
  aspectRatio?: number | null;
  aspectClass?: string;
  isNsfw?: boolean;
  isNsfwVisible?: boolean;
  matureContentLabel?: string;
  paintedAt?: string;
  /** Carousel slides — caption under image, no brush reveal. */
  layout?: PaintingCardLayout;
  /** Opt-in grid band hover. Default true for grid cards. */
  brushReveal?: boolean;
  /** Pin brush overlay open (Storybook). */
  brushHovered?: boolean;
  brushSeedKey?: string;
  strokeVariantIndex?: number;
  palette?: BrushPalette | null;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    'aria-label'?: string;
    children: React.ReactNode;
  }>;
  ImageComponent?: React.ComponentType<PaintingCardImageComponentProps>;
  /** Enables shared layout morph into painting detail hero. */
  imageLayoutId?: string;
  imageLayoutTransition?: Transition;
  /** App-provided frame so layoutId uses the same motion instance as the detail page. */
  ImageMorphFrame?: ContentMorphFrameComponent;
  className?: string;
};

function DefaultImage({
  fill,
  className,
  alt = '',
  src,
  priority: _priority,
  fetchPriority: _fetchPriority,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  quality: _quality,
  sizes: _sizes,
}: PaintingCardImageComponentProps) {
  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined;

  return <img src={src} alt={alt} className={className} style={fillStyle} />;
}

/** Framework-agnostic painting card — grid band reveal or carousel caption. */
export function PaintingCardView({
  title,
  href,
  imageSrc,
  imageAlt,
  blurDataURL: _blurDataURL,
  imagePriority = false,
  tags = [],
  badges = [],
  format,
  aspectRatio,
  aspectClass,
  isNsfw = false,
  isNsfwVisible = false,
  matureContentLabel,
  paintedAt,
  layout = 'default',
  brushReveal = true,
  brushHovered,
  brushSeedKey,
  strokeVariantIndex,
  palette,
  LinkComponent,
  ImageComponent = DefaultImage,
  imageLayoutId,
  imageLayoutTransition,
  ImageMorphFrame,
  className,
}: PaintingCardViewProps) {
  const reduceMotion = useReducedMotion();

  const cardImageLayout = resolvePaintingCardLayout({
    format,
    aspectRatio: aspectRatio ?? null,
  });

  const showNsfwBlur = isNsfw && !isNsfwVisible;
  const isCarousel = layout === 'carousel';
  const useBrushReveal = brushReveal && !isCarousel;

  const brushSeed = paintingBrushSeed(brushSeedKey ?? title ?? href);
  const brushIndex = strokeVariantIndex ?? brushSeed;
  const strokeColors = getBrushStrokeColors(brushIndex, palette ?? null);

  const imageEl = imageSrc ? (
    <ImageComponent
      src={imageSrc}
      alt={imageAlt ?? title ?? 'Painting'}
      fill
      sizes='(min-width: 1040px) 20vw, 50vw'
      priority={imagePriority}
      fetchPriority={imagePriority ? 'high' : 'auto'}
      placeholder='empty'
      quality={80}
      className={cn('h-full w-full object-cover', showNsfwBlur && getNsfwImageBlurClass('card'))}
    />
  ) : undefined;

  const effectiveLayoutId = imageLayoutId && !reduceMotion ? imageLayoutId : undefined;
  const imageFrameClassName = 'relative h-full w-full overflow-hidden rounded-xl';

  const imageNode = imageEl ? (
    effectiveLayoutId && ImageMorphFrame ? (
      <ImageMorphFrame
        layoutId={effectiveLayoutId}
        transition={imageLayoutTransition}
        className={imageFrameClassName}
      >
        {imageEl}
        {useBrushReveal ? (
          <BrushRevealLayer
            {...strokeColors}
            strokeVariantIndex={brushIndex}
            revealSeed={brushSeed}
            paintingFormat={cardImageLayout.format}
            title={title || null}
            year={paintedAt ?? null}
          />
        ) : null}
      </ImageMorphFrame>
    ) : (
      (() => {
        const ImageFrame = effectiveLayoutId ? motion.div : 'div';

        return (
          <ImageFrame
            {...(effectiveLayoutId
              ? {
                  layoutId: effectiveLayoutId,
                  initial: false as const,
                  transition: imageLayoutTransition,
                }
              : {})}
            className={imageFrameClassName}
          >
            {effectiveLayoutId ? (
              <motion.div layout='position' className='relative h-full w-full'>
                {imageEl}
              </motion.div>
            ) : (
              imageEl
            )}
            {useBrushReveal ? (
              <BrushRevealLayer
                {...strokeColors}
                strokeVariantIndex={brushIndex}
                revealSeed={brushSeed}
                paintingFormat={cardImageLayout.format}
                title={title || null}
                year={paintedAt ?? null}
              />
            ) : null}
          </ImageFrame>
        );
      })()
    )
  ) : undefined;

  const card = (
    <PaintingCard
      title={title}
      href={href}
      LinkComponent={LinkComponent}
      image={imageNode}
      badges={badges}
      caption={isCarousel && !showNsfwBlur}
      matureContentLabel={showNsfwBlur ? NSFW_COMPACT_LABEL : undefined}
      className={className ?? aspectClass ?? cardImageLayout.aspectClass}
    />
  );

  if (!imageEl || !useBrushReveal) {
    return card;
  }

  return (
    <BrushRevealWrap enabled={brushReveal} hovered={brushHovered}>
      {card}
    </BrushRevealWrap>
  );
}
