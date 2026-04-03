'use client';

/**
 * CodeGrid-style SVG brush strokes: two organic paths (different viewBoxes), dash reveal + stroke-width.
 * GSAP targets `[data-hero-svg] path`. Parent should use `overflow-hidden` + radius so strokes clip to the image.
 */

/** Prepare paths for dash-offset animation (call once per card root that contains `[data-hero-svg]`). */
export function initHeroSvgStrokePaths(root: HTMLElement | null): void {
  if (!root) return;
  const paths = root.querySelectorAll<SVGPathElement>('[data-hero-svg] path');
  paths.forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  });
}

/** Organic stroke paths from CodeGrid “SVG Image Hover” example (brush-like, not circular). */
const BRUSH_PATH_PRIMARY =
  'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262';

const BRUSH_PATH_SECONDARY =
  'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012';

/** Initial / rest stroke width (matches example markup). */
export const HERO_BRUSH_STROKE_WIDTH_REST = 200;
/** Peak stroke width on hover (matches example script). */
export const HERO_BRUSH_STROKE_WIDTH_HOVER = 700;

/**
 * Stroke colors for hero SVG hover — hex values taken from `@wisihe/tokens` primitives
 * (`packages/tokens/tokens/primitives/color.json`). Each pair crosses two families for contrast.
 * Large set so carousel indices rarely repeat nearby.
 */
export const HERO_STROKE_COLOR_PAIRS: ReadonlyArray<{ accent: string; secondary: string }> = [
  { accent: '#ff4400', secondary: '#8b5cf6' }, // neon-orange.500 + brand-2.500
  { accent: '#ff007f', secondary: '#14b8a6' }, // neon-pink.500 + brand-3.500
  { accent: '#3b82f6', secondary: '#ff7442' }, // brand-1.500 + neon-orange.400
  { accent: '#7c3aed', secondary: '#eab308' }, // brand-2.600 + neon-yellow.500
  { accent: '#14b8a6', secondary: '#ec4899' }, // brand-3.500 + accent-legacy.500
  { accent: '#10b981', secondary: '#ff54b0' }, // success-primitive.500 + neon-pink.400
  { accent: '#d97706', secondary: '#60a5fa' }, // warning-primitive.600 + brand-1.400
  { accent: '#ef4444', secondary: '#2dd4bf' }, // danger-primitive.500 + brand-3.400
  { accent: '#e02e00', secondary: '#93c5fd' }, // neon-orange.600 + brand-1.300
  { accent: '#a78bfa', secondary: '#ff4400' }, // brand-2.400 + neon-orange.500
  { accent: '#facc15', secondary: '#0f766e' }, // neon-yellow.400 + brand-3.700
  { accent: '#f472b6', secondary: '#2563eb' }, // accent-legacy.400 + brand-1.600
  { accent: '#ff54b0', secondary: '#059669' }, // neon-pink.400 + success-primitive.600
  { accent: '#c4b5fd', secondary: '#e02e00' }, // brand-2.300 + neon-orange.600
  { accent: '#99f6e4', secondary: '#db2777' }, // brand-3.200 + accent-legacy.600
  { accent: '#fde047', secondary: '#7c3aed' }, // neon-yellow.300 + brand-2.600
  { accent: '#ff91cc', secondary: '#1d4ed8' }, // neon-pink.300 + brand-1.700
  { accent: '#ffa379', secondary: '#5b21b6' }, // neon-orange.300 + brand-2.800
  { accent: '#5eead4', secondary: '#f87171' }, // brand-3.300 + danger-primitive.400
  { accent: '#fbbf24', secondary: '#6d28d9' }, // warning-primitive.400 + brand-2.700
  { accent: '#6ee7b7', secondary: '#be185d' }, // success-primitive.300 + accent-legacy.700
  { accent: '#fca5a5', secondary: '#0d9488' }, // danger-primitive.300 + brand-3.600
  { accent: '#bfdbfe', secondary: '#b5005a' }, // brand-1.200 + neon-pink.700
  { accent: '#f9a8d4', secondary: '#115e59' }, // accent-legacy.300 + brand-3.800
  { accent: '#ca8a04', secondary: '#1e40af' }, // neon-yellow.600 + brand-1.800
  { accent: '#fecaca', secondary: '#047857' }, // danger-primitive.200 + success-primitive.700
  { accent: '#ede9fe', secondary: '#b82000' }, // brand-2.100 + neon-orange.700
  { accent: '#ccfbf1', secondary: '#831843' }, // brand-3.100 + accent-legacy.900
  { accent: '#fcd34d', secondary: '#4c1d95' }, // warning-primitive.300 + brand-2.900
  { accent: '#34d399', secondary: '#ff007f' }, // success-primitive.400 + neon-pink.500
  { accent: '#60a5fa', secondary: '#941b06' }, // brand-1.400 + neon-orange.800
  { accent: '#a78bfa', secondary: '#ca8a04' }, // brand-2.400 + neon-yellow.600
  { accent: '#2dd4bf', secondary: '#b91c1c' }, // brand-3.400 + danger-primitive.700
  { accent: '#fef08a', secondary: '#6d28d9' }, // neon-yellow.200 + brand-2.700
  { accent: '#fbcfe8', secondary: '#0f766e' }, // accent-legacy.200 + brand-3.700
  { accent: '#ffbee0', secondary: '#1e3a8a' }, // neon-pink.200 + brand-1.900
  { accent: '#ffccaa', secondary: '#9d174d' }, // neon-orange.200 + accent-legacy.800
  { accent: '#ddd6fe', secondary: '#e02e00' }, // brand-2.200 + neon-orange.600
  { accent: '#a7f3d0', secondary: '#7c3aed' }, // success-primitive.200 + brand-2.600
  { accent: '#93c5fd', secondary: '#db006d' }, // brand-1.300 + neon-pink.600
  { accent: '#5eead4', secondary: '#92400e' }, // brand-3.300 + warning-primitive.800
  { accent: '#f472b6', secondary: '#115e59' }, // accent-legacy.400 + brand-3.800
  { accent: '#eab308', secondary: '#4c1d95' }, // neon-yellow.500 + brand-2.900
  { accent: '#2563eb', secondary: '#ff7442' }, // brand-1.600 + neon-orange.400
  { accent: '#8b5cf6', secondary: '#10b981' }, // brand-2.500 + success-primitive.500
  { accent: '#0d9488', secondary: '#f59e0b' }, // brand-3.600 + warning-primitive.500
  { accent: '#ec4899', secondary: '#34d399' }, // accent-legacy.500 + success-primitive.400
  { accent: '#b82000', secondary: '#93c5fd' }, // neon-orange.700 + brand-1.300
  { accent: '#172554', secondary: '#fde047' }, // brand-1.950 + neon-yellow.300
];

export function getHeroStrokeColors(index: number): {
  accentColor: string;
  secondaryColor: string;
} {
  const pair = HERO_STROKE_COLOR_PAIRS[index % HERO_STROKE_COLOR_PAIRS.length]!;
  return { accentColor: pair.accent, secondaryColor: pair.secondary };
}

type HeroPaintingSvgHoverProps = {
  accentColor: string;
  secondaryColor: string;
  title?: string | null;
};

export function HeroPaintingSvgHover({
  accentColor,
  secondaryColor,
  title,
}: HeroPaintingSvgHoverProps) {
  return (
    <>
      <div data-hero-svg className='pointer-events-none absolute inset-0 z-2' aria-hidden>
        <div className='svg-stroke svg-stroke-1 absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-150'>
          <svg
            className='block h-full w-full'
            viewBox='0 0 2453 2273'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='xMidYMid meet'
          >
            <path
              d={BRUSH_PATH_PRIMARY}
              stroke={accentColor}
              strokeWidth={HERO_BRUSH_STROKE_WIDTH_REST}
              strokeLinecap='round'
              fill='none'
            />
          </svg>
        </div>
        <div className='svg-stroke svg-stroke-2 absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-150'>
          <svg
            className='block h-full w-full'
            viewBox='0 0 2250 2535'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='xMidYMid meet'
          >
            <path
              d={BRUSH_PATH_SECONDARY}
              stroke={secondaryColor}
              strokeWidth={HERO_BRUSH_STROKE_WIDTH_REST}
              strokeLinecap='round'
              fill='none'
            />
          </svg>
        </div>
      </div>
      {title ? (
        <div
          data-hero-title
          className='pointer-events-none absolute bottom-2 left-2 right-2 z-3 opacity-0'
        >
          <p className='line-clamp-2 text-left font-serif text-lg font-medium leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-xl'>
            {title}
          </p>
        </div>
      ) : null}
    </>
  );
}
