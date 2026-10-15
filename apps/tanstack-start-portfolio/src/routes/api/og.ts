import { createFileRoute } from '@tanstack/react-router';
import { OG_IMAGE_QUERY } from '@wisihe/sanity-queries';
import { isEmptyObject, isNotEmptyObject } from '@wisihe/utils';
import { getSanityClientForRequest, urlForImage } from '@/lib/sanity';

interface PaletteColor {
  background?: string;
  foreground?: string;
}

interface Palette {
  [key: string]: unknown;
  vibrant?: PaletteColor;
  darkVibrant?: PaletteColor;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
          return new Response('Missing id parameter', { status: 404 });
        }

        const sanity = getSanityClientForRequest(request);
        const data = await sanity.fetch(OG_IMAGE_QUERY, { id });

        if (!data?.image || isEmptyObject(data.image)) {
          return new Response('Not found', { status: 404 });
        }

        const imageUrl = urlForImage(data.image)?.width(1200).height(630).url();

        if (!imageUrl) {
          return new Response('Image not found', { status: 404 });
        }

        const format = url.searchParams.get('format');

        // If SVG format is requested, render an inline SVG card with text and gradient
        if (format === 'svg') {
          const { palette } = data.image as { palette?: Palette };
          let vibrant = '#3B82F6';
          let darkVibrant = '#1D4ED8';
          if (palette && isNotEmptyObject(palette)) {
            const typedPalette = palette as Palette;
            vibrant = typedPalette.vibrant?.background || vibrant;
            darkVibrant = typedPalette.darkVibrant?.background || darkVibrant;
          }
          const title = data.title ? escapeXml(data.title) : '';

          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${vibrant}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${darkVibrant}" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <image href="${imageUrl}" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1200" height="630" fill="url(#overlay)" style="mix-blend-mode: overlay;"/>
  <rect width="1200" height="630" fill="rgba(0,0,0,0.2)"/>
  <text x="1140" y="580" text-anchor="end" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">#${title}</text>
</svg>`;

          return new Response(svg, {
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control':
                'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            },
          });
        }

        // Default: redirect directly to the optimized 1200x630 CDN image URL
        return new Response(null, {
          status: 307,
          headers: {
            Location: imageUrl,
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        });
      },
    },
  },
});
