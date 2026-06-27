'use client';

/**
 * Card brush reveal — wash + four thick strokes + metadata (tags, badges, title).
 * Driven by GSAP via `BrushRevealWrap` / `useBrushReveal`.
 */

import { type ReactNode, useId } from 'react';

import {
  type BrushStrokeLayer,
  getBrushStrokeVariant,
  paintingBrushSeed,
} from '@/app/components/marketing/HeroSection/brushStrokeVariants';

export { getBrushStrokeVariant, paintingBrushSeed };

const LAYER_BASE_CLASS =
  'svg-stroke absolute left-1/2 top-1/2 h-[155%] w-[155%] -translate-x-1/2 -translate-y-1/2 origin-center';

function layerTransform(layer: BrushStrokeLayer): string {
  return layer.mirror
    ? `rotate(${layer.rotateDeg}deg) scaleX(-1)`
    : `rotate(${layer.rotateDeg}deg)`;
}

function cardCoverScale(variantScale: number): number {
  return Math.min(variantScale * 0.88, 2.35);
}

function BrushStrokeSvg({
  layer,
  color,
  className,
  filterId,
  strokeWidthRest,
}: {
  layer: BrushStrokeLayer;
  color: string;
  className: string;
  filterId: string;
  strokeWidthRest: number;
}) {
  return (
    <div className={className} style={{ transform: layerTransform(layer) }}>
      <svg
        className='block h-full w-full'
        viewBox={layer.viewBox}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='xMidYMid slice'
      >
        <title>Decorative brush stroke</title>
        <path
          d={layer.d}
          stroke={color}
          strokeWidth={strokeWidthRest}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
          filter={`url(#${filterId})`}
          style={{ mixBlendMode: 'multiply', opacity: 0 }}
        />
      </svg>
    </div>
  );
}

export type BrushRevealBadge = {
  key: string;
  icon: ReactNode;
  label: string;
};

export type BrushRevealLayerProps = {
  accentColor: string;
  secondaryColor: string;
  washColor: string;
  strokeVariantIndex?: number;
  title?: string | null;
  medium?: string | null;
  year?: string | null;
  tags?: string[] | null;
  badges?: BrushRevealBadge[];
  isNsfwBlurred?: boolean;
};

const REST_STROKE_WIDTH = 72;

export function BrushRevealLayer({
  accentColor,
  secondaryColor,
  washColor,
  strokeVariantIndex = 0,
  title,
  medium,
  year,
  tags,
  badges = [],
  isNsfwBlurred = false,
}: BrushRevealLayerProps) {
  const variant = getBrushStrokeVariant(strokeVariantIndex);
  const scale = cardCoverScale(variant.scale);
  const displayTags = (tags ?? []).filter(Boolean);
  const visibleTags = displayTags.slice(0, 4);
  const filterId = useId().replace(/:/g, '');

  const chipClass =
    'rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-sm sm:text-[10px]';

  const layerColors = [accentColor, secondaryColor, accentColor, secondaryColor] as const;

  return (
    <>
      <div
        data-brush-wash
        className='pointer-events-none absolute inset-0 z-[6] opacity-0'
        style={{ backgroundColor: washColor }}
        aria-hidden
      />

      <div
        data-brush-svg
        data-nsfw-blurred={isNsfwBlurred ? '' : undefined}
        className='pointer-events-none absolute inset-0 z-10 overflow-hidden'
        aria-hidden
        style={{ transform: `scale(${scale})` }}
      >
        <svg className='absolute h-0 w-0' aria-hidden='true'>
          <title>Brush stroke filters</title>
          <defs>
            <filter id={filterId} x='-25%' y='-25%' width='150%' height='150%'>
              <feGaussianBlur in='SourceGraphic' stdDeviation={2.4} result='blur' />
              <feMerge>
                <feMergeNode in='blur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {variant.layers.map((layer, index) => (
          <BrushStrokeSvg
            key={`${variant.id}-${layer.d.slice(0, 12)}-${layer.rotateDeg}`}
            layer={layer}
            color={layerColors[index % layerColors.length] ?? accentColor}
            filterId={filterId}
            className={`${LAYER_BASE_CLASS} svg-stroke-${index + 1}`}
            strokeWidthRest={REST_STROKE_WIDTH}
          />
        ))}
      </div>

      <div
        data-brush-overlay
        className='pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-2.5 opacity-0'
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='flex min-w-0 flex-1 flex-wrap items-start gap-1 pr-1'>
            {isNsfwBlurred ? (
              <span className={`${chipClass} border-white/25 bg-black/65`}>Mature content</span>
            ) : null}
            {visibleTags.length > 0 ? (
              <div className='flex flex-wrap gap-1' data-brush-tags>
                {visibleTags.map(tag => (
                  <span
                    key={tag}
                    className={chipClass}
                    style={{ boxShadow: `0 0 10px ${accentColor}44` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {badges.length > 0 ? (
            <ul
              className='flex shrink-0 flex-col gap-1'
              data-brush-badges
              aria-label='Painting attributes'
            >
              {badges.map(badge => (
                <li key={badge.key}>
                  <span
                    className='inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-black/55 text-white shadow-sm backdrop-blur-md'
                    title={badge.label}
                  >
                    <span className='sr-only'>{badge.label}</span>
                    {badge.icon}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {title ? (
          <div data-brush-title className='mt-auto flex flex-col items-start space-y-0.5 text-left'>
            <p className='line-clamp-2 font-serif text-base font-medium italic leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:text-lg'>
              {title}
            </p>
            {(year || medium) && (
              <div className='flex flex-wrap items-center gap-1.5'>
                {year ? (
                  <span className='rounded border border-white/10 bg-black/50 px-1.5 py-0.5 font-sans text-[9px] font-bold text-white/90 backdrop-blur-sm'>
                    {year}
                  </span>
                ) : null}
                {medium ? (
                  <span className='max-w-[150px] truncate font-mono text-[8px] font-semibold uppercase tracking-wider text-white/80 drop-shadow-sm'>
                    {medium}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
