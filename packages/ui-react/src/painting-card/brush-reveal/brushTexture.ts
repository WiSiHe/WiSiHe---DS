import type { CSSProperties } from 'react';

/**
 * Static paint grain: fine, even speckle that thins the paint very slightly (no directional streaks, so nothing
 * reads as a scanline while the stroke draws). A tiling SVG image used as a CSS mask, rasterised once.
 */
const GRAIN_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>",
  "<filter id='t' x='0' y='0' width='100%' height='100%'>",
  "<feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' seed='7' stitchTiles='stitch'/>",
  "<feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.8 0 0 0 0.66'/>",
  '</filter>',
  "<rect width='100%' height='100%' filter='url(#t)'/>",
  '</svg>',
].join('');

const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

export const BRUSH_TEXTURE_STYLE: CSSProperties = {
  maskImage: GRAIN_URL,
  WebkitMaskImage: GRAIN_URL,
  maskSize: '240px 240px',
  WebkitMaskSize: '240px 240px',
  maskRepeat: 'repeat',
  WebkitMaskRepeat: 'repeat',
};
