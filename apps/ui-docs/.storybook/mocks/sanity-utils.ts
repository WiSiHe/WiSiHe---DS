/** Storybook stand-in for `@/sanity/lib/utils` — no Sanity client or env required. */

const DEMO_URL = 'https://www.wisihe.no/images/cute.jpg';

type SanityImageSource = {
  asset?: { _ref?: string };
};

function createImageBuilder() {
  const chain = {
    width: () => chain,
    height: () => chain,
    fit: () => chain,
    quality: () => chain,
    auto: () => ({ url: () => DEMO_URL }),
    url: () => DEMO_URL,
  };
  return chain;
}

export const urlForImage = (source: SanityImageSource | null | undefined) => {
  if (!source?.asset?._ref) {
    return undefined;
  }

  return createImageBuilder();
};

export function getCroppedAspectRatio(image: { aspectRatio?: number; crop?: unknown } | null) {
  if (!image) return 3 / 4;
  return image.aspectRatio ?? 3 / 4;
}

export const urlForFullImage = urlForImage;
