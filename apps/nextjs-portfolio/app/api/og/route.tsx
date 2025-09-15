import { client } from '@/sanity/lib/client';
import { OG_IMAGE_QUERY } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { isEmptyObject, isNotEmptyObject } from '@wisihe/utils';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

interface PaletteColor {
  background?: string;
  foreground?: string;
}

interface Palette {
  vibrant?: PaletteColor;
  darkVibrant?: PaletteColor;
}

export const runtime = 'edge';

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    notFound();
  }

  const data = await client.fetch(OG_IMAGE_QUERY, { id });

  if (!data) {
    notFound();
  }

  const { title, image } = data;

  if (!image || isEmptyObject(image)) {
    notFound();
  }

  const { palette } = image;

  let vibrantBackground = '#3B82F6';
  let darkVibrantBackground = '#3B82F6';

  if (palette && isNotEmptyObject(palette)) {
    const typedPalette = palette as Palette;
    vibrantBackground = typedPalette?.vibrant?.background || '#3B82F6';
    darkVibrantBackground = typedPalette?.darkVibrant?.background || '#3B82F6';
  }

  if (!data) {
    notFound();
  }

  const text = title || '';

  return new ImageResponse(
    (
      <div tw="flex w-full h-full relative">
        {/* Content container */}
        <div tw="flex flex-row w-full h-full relative">
          {/* Text content */}

          {data.image && (
            <div tw="flex w-full h-full overflow-hidden">
              {image ? (
                <img
                  src={urlForImage(image)?.width(1200).height(630).url()}
                  alt=""
                  tw="w-full h-full object-cover"
                />
              ) : null}
            </div>
          )}
          <div
            tw="absolute inset-0 mix-blend-overlay opacity-50"
            style={{
              background: `linear-gradient(135deg, ${vibrantBackground} 0%, ${darkVibrantBackground} 100%)`,
            }}
          />
          <div tw="absolute z-10  right-4 bottom-4 flex items-center justify-center px-10">
            <h1 tw="text-7xl tracking-tight leading-none text-white leading-tight">
              <strong>#{text}</strong>
            </h1>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await loadGoogleFont('Inter', text),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
