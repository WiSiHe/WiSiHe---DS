'use client';

/**
 * Static “painted over the blur” cover for mature-content thumbnails only.
 * Palette wash + visible brush strokes at rest; intensifies on group hover/focus.
 */

import { cn } from '@wisihe/utils';
import { type CSSProperties, useId } from 'react';
import { getBrushProfileConfig } from '@/app/components/marketing/HeroSection/brushStrokeConstants';
import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
} from '@/app/components/marketing/HeroSection/brushStrokeVariants';
import {
  NSFW_STROKE_OPACITY_HOVER,
  NSFW_WASH_OPACITY,
  NSFW_WASH_OPACITY_HOVER,
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
  strokeWidth,
  layerSizePercent,
  strokeOpacity,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  filterId: string;
  strokeWidth: number;
  layerSizePercent: number;
  strokeOpacity: number;
}) {
  return (
    <div
      className={className}
      style={{ ...layerSizeStyle(layerSizePercent), transform: layerTransform(layer) }}
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
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          filter={`url(#${filterId})`}
          className='transition-opacity duration-300 ease-out group-hover:opacity-[var(--nsfw-stroke-hover)] group-focus-within:opacity-[var(--nsfw-stroke-hover)]'
          style={
            {
              opacity: strokeOpacity,
              '--nsfw-stroke-hover': NSFW_STROKE_OPACITY_HOVER,
            } as CSSProperties
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
  /**
   * Skip SVG strokes below `md` — wash + blur only on small screens (perf trial).
   * @default true
   */
  liteOnMobile?: boolean;
};

export function NsfwBrushCover({
  accentColor,
  secondaryColor,
  washColor,
  strokeVariantIndex = 0,
  className,
  liteOnMobile = true,
}: NsfwBrushCoverProps) {
  const brushProfile = getBrushProfileConfig('nsfwCover');
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  const scale = brushProfile.coverScale(variant.scale);
  const filterId = useId().replace(/:/g, '');
  const layerColors = [accentColor, secondaryColor, accentColor, secondaryColor] as const;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-[8]', className)}
      data-nsfw-brush-cover
      aria-hidden
      style={
        {
          '--nsfw-wash-rest': NSFW_WASH_OPACITY,
          '--nsfw-wash-hover': NSFW_WASH_OPACITY_HOVER,
        } as CSSProperties
      }
    >
      <div
        className='absolute inset-0 transition-opacity duration-300 ease-out group-hover:opacity-[var(--nsfw-wash-hover)] group-focus-within:opacity-[var(--nsfw-wash-hover)]'
        style={{ backgroundColor: washColor, opacity: NSFW_WASH_OPACITY }}
      />

      <div
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-within:scale-[1.02]',
          liteOnMobile && 'max-md:hidden md:block',
        )}
      >
        <div className='absolute inset-0 overflow-hidden' style={{ transform: `scale(${scale})` }}>
          <svg className='absolute h-0 w-0' aria-hidden>
            <defs>
              <filter id={filterId} x='-25%' y='-25%' width='150%' height='150%'>
                <feGaussianBlur
                  in='SourceGraphic'
                  stdDeviation={brushProfile.strokeBlur}
                  result='blur'
                />
                <feMerge>
                  <feMergeNode in='blur' />
                  <feMergeNode in='SourceGraphic' />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {variant.layers.slice(0, brushProfile.layerCount).map((layer, index) => (
            <NsfwBrushStroke
              key={`${variant.id}-${layer.d.slice(0, 12)}-${layer.rotateDeg}`}
              layer={layer}
              color={layerColors[index % layerColors.length] ?? accentColor}
              filterId={filterId}
              className={LAYER_BASE_CLASS}
              strokeWidth={brushProfile.rest}
              layerSizePercent={brushProfile.layerSizePercent}
              strokeOpacity={brushProfile.strokeOpacity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
