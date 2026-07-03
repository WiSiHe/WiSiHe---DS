'use client';

/**
 * Static “painted over the blur” cover for mature-content thumbnails.
 * Strokes stay inside the image clip (below tags / title overlays).
 */

import { cn } from '@wisihe/utils';
import { type CSSProperties, useId } from 'react';
import { resolveBrushProfile } from '@/app/components/marketing/HeroSection/brushStrokeConstants';
import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
} from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import {
  resolveBrushLayerColors,
  resolveBrushLayerMetrics,
} from '@/app/components/paintings/BrushReveal/brushStrokeRender';
import { useBrushRevealLite } from '@/lib/paintings/mediaCapabilities';
import {
  getNsfwStrokeOpacity,
  getNsfwWashOpacity,
  NSFW_CARD_LAYER_COUNT,
  NSFW_THUMBNAIL_LAYER_COUNT,
  type NsfwCoverVariant,
} from '@/lib/paintings/nsfwCover';

const LAYER_BASE_CLASS =
  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center';

function layerSizeStyle(layerSizePercent: number): CSSProperties {
  const size = `${layerSizePercent}%`;
  return { width: size, height: size };
}

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

function NsfwBrushStroke({
  layer,
  color,
  className,
  filterId,
  strokeWidthRest,
  strokeWidthHover,
  layerSizePercent,
  strokeOpacity,
  useStrokeFilter,
  paintOver,
  staticCover,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  filterId: string;
  strokeWidthRest: number;
  strokeWidthHover: number;
  layerSizePercent: number;
  strokeOpacity: number;
  useStrokeFilter: boolean;
  paintOver: boolean;
  staticCover: boolean;
}) {
  const metrics = resolveBrushLayerMetrics(
    layer,
    strokeWidthRest,
    strokeWidthHover,
    strokeOpacity,
    paintOver,
  );
  const filter = useStrokeFilter ? `url(#${filterId})` : undefined;

  return (
    <div
      className={className}
      style={{
        ...layerSizeStyle(layerSizePercent),
        transform: layerTransform(layer),
      }}
    >
      <svg
        className='block h-full w-full'
        viewBox={layer.viewBox}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='xMidYMid slice'
        aria-hidden
      >
        <path
          d={layer.d}
          stroke={color}
          strokeWidth={metrics.underWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          filter={filter}
          className={
            staticCover
              ? undefined
              : 'transition-opacity duration-300 ease-out group-hover:opacity-[var(--nsfw-stroke-under-hover)] group-focus-within:opacity-[var(--nsfw-stroke-under-hover)]'
          }
          style={
            staticCover
              ? { opacity: metrics.underOpacity }
              : ({
                  opacity: metrics.underOpacity,
                  '--nsfw-stroke-under-hover': metrics.underOpacity * 1.15,
                } as CSSProperties)
          }
        />
        <path
          d={layer.d}
          stroke={color}
          strokeWidth={metrics.hoverWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          filter={filter}
          className={
            staticCover
              ? undefined
              : 'transition-opacity duration-300 ease-out group-hover:opacity-[var(--nsfw-stroke-hover)] group-focus-within:opacity-[var(--nsfw-stroke-hover)]'
          }
          style={
            staticCover
              ? { opacity: metrics.peakOpacity }
              : ({ opacity: metrics.peakOpacity } as CSSProperties)
          }
        />
      </svg>
    </div>
  );
}

export type NsfwBrushCoverProps = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
  strokeVariantIndex?: number;
  className?: string;
  /** Thumbnail skips blend modes (reads better on light UI + small tiles). */
  variant?: NsfwCoverVariant;
};

export function NsfwBrushCover({
  accentColor,
  secondaryColor,
  washColor,
  strokeVariantIndex = 0,
  className,
  variant: coverVariant = 'card',
}: NsfwBrushCoverProps) {
  const isThumbnail = coverVariant === 'thumbnail';
  const staticCover = isThumbnail;
  const liteMode = useBrushRevealLite();
  const brushProfile = resolveBrushProfile('nsfwCover', liteMode);
  const useStrokeFilter = !isThumbnail && brushProfile.strokeBlur > 0;
  const strokeVariant = getBrushStrokeVariant(strokeVariantIndex);
  const scale = brushProfile.coverScale(strokeVariant.scale);
  const filterId = useId().replace(/:/g, '');

  const targetLayerCount = isThumbnail ? NSFW_THUMBNAIL_LAYER_COUNT : NSFW_CARD_LAYER_COUNT;
  const layerCount = Math.min(
    targetLayerCount,
    strokeVariant.layers.length,
    liteMode ? Math.min(targetLayerCount, isThumbnail ? 3 : 2) : targetLayerCount,
  );
  const layerColors = resolveBrushLayerColors(
    layerCount,
    accentColor,
    secondaryColor,
    washColor,
    isThumbnail && brushProfile.solidFill,
  );
  const strokeWidthRest = isThumbnail ? brushProfile.rest * 1.08 : brushProfile.rest;
  const strokeWidthHover = isThumbnail ? brushProfile.rest * 1.12 : brushProfile.hover;
  const strokeOpacityRest = liteMode
    ? Math.min(getNsfwStrokeOpacity(coverVariant, false), brushProfile.strokeOpacity)
    : getNsfwStrokeOpacity(coverVariant, false);
  const strokeOpacityHover = getNsfwStrokeOpacity(coverVariant, true);
  const layerSizePercent = isThumbnail
    ? brushProfile.layerSizePercent * 1.06
    : brushProfile.layerSizePercent;
  const washOpacityRest = getNsfwWashOpacity(coverVariant, false);
  const washOpacityHover = getNsfwWashOpacity(coverVariant, true);

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]',
        className,
      )}
      data-nsfw-brush-cover
      data-nsfw-variant={coverVariant}
      aria-hidden
      style={
        {
          '--nsfw-wash-rest': washOpacityRest,
          '--nsfw-wash-hover': washOpacityHover,
          '--nsfw-stroke-hover': strokeOpacityHover,
        } as CSSProperties
      }
    >
      {isThumbnail ? (
        <div className='absolute inset-0 bg-black/15 dark:bg-black/25' aria-hidden />
      ) : null}

      {washOpacityRest > 0 ? (
        <div
          className={
            staticCover
              ? 'absolute inset-0'
              : 'absolute inset-0 transition-opacity duration-300 ease-out group-hover:opacity-[var(--nsfw-wash-hover)] group-focus-within:opacity-[var(--nsfw-wash-hover)]'
          }
          style={{
            backgroundColor: washColor,
            opacity: washOpacityRest,
          }}
        />
      ) : null}

      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden' style={{ transform: `scale(${scale})` }}>
          {useStrokeFilter ? (
            <svg className='absolute h-0 w-0' aria-hidden>
              <defs>
                <filter
                  id={filterId}
                  x='-40%'
                  y='-40%'
                  width='180%'
                  height='180%'
                  colorInterpolationFilters='sRGB'
                >
                  <feTurbulence
                    type='fractalNoise'
                    baseFrequency='0.045 0.12'
                    numOctaves='2'
                    seed={strokeVariantIndex % 97}
                    result='noise'
                  />
                  <feDisplacementMap
                    in='SourceGraphic'
                    in2='noise'
                    scale={2.4}
                    xChannelSelector='R'
                    yChannelSelector='G'
                    result='displaced'
                  />
                  <feGaussianBlur
                    in='displaced'
                    stdDeviation={brushProfile.strokeBlur * 0.55}
                    result='soft'
                  />
                  <feMerge>
                    <feMergeNode in='soft' />
                    <feMergeNode in='displaced' />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          ) : null}

          {strokeVariant.layers.slice(0, layerCount).map((layer, index) => (
            <NsfwBrushStroke
              key={`${strokeVariant.id}-${layer.d.slice(0, 12)}-${layer.rotateDeg}`}
              layer={layer}
              color={layerColors[index % layerColors.length] ?? accentColor}
              filterId={filterId}
              className={LAYER_BASE_CLASS}
              strokeWidthRest={strokeWidthRest}
              strokeWidthHover={strokeWidthHover}
              layerSizePercent={layerSizePercent}
              strokeOpacity={strokeOpacityRest}
              useStrokeFilter={useStrokeFilter}
              paintOver={isThumbnail && brushProfile.solidFill}
              staticCover={staticCover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
