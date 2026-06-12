import type { Metadata } from 'next';
import { urlForImage } from '@/sanity/lib/utils';
import { AUTHOR, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './constants';

export type SanitySeoFields = {
  title?: string | null;
  description?: string | null;
  image?: unknown;
  noIndex?: boolean | null;
};

type SanityImageSource = Parameters<typeof urlForImage>[0];

export function truncateMetaDescription(text: string, max = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

export function resolveSeoImageUrl(
  seoImage?: unknown,
  fallbackImage?: unknown,
  alt?: string,
): { url: string; alt: string } {
  const source = (seoImage ?? fallbackImage) as SanityImageSource | null | undefined;
  const built = source?.asset?._ref
    ? urlForImage(source)?.width(1200).height(630).quality(85).url()
    : undefined;

  return {
    url: built ?? DEFAULT_OG_IMAGE.url,
    alt:
      alt?.trim() || (source as { alt?: string } | undefined)?.alt?.trim() || DEFAULT_OG_IMAGE.alt,
  };
}

export type BuildContentMetadataInput = {
  /** Page title without site suffix — layout template adds branding */
  title: string;
  description: string;
  /** Path starting with / */
  path: string;
  seoImage?: unknown;
  fallbackImage?: unknown;
  imageAlt?: string;
  /** Absolute or site-relative OG image override (e.g. dynamic /api/og) */
  imageUrlOverride?: string;
  noIndex?: boolean;
  openGraphType?: 'website' | 'article' | 'video.other';
  keywords?: string[];
  publishedTime?: string;
};

export function buildContentMetadata(input: BuildContentMetadataInput): Metadata {
  const path = input.path.startsWith('/') ? input.path : `/${input.path}`;
  const url = `${SITE_URL}${path}`;
  const description = truncateMetaDescription(input.description);
  const resolvedImage = input.imageUrlOverride
    ? { url: input.imageUrlOverride, alt: input.imageAlt ?? input.title }
    : resolveSeoImageUrl(input.seoImage, input.fallbackImage, input.imageAlt ?? input.title);

  const metadata: Metadata = {
    title: input.title,
    description,
    alternates: { canonical: url },
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    openGraph: {
      title: input.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: input.openGraphType ?? 'article',
      images: [
        {
          url: resolvedImage.url,
          width: 1200,
          height: 630,
          alt: resolvedImage.alt,
        },
      ],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description,
      images: [resolvedImage.url],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };

  if (input.keywords?.length) {
    metadata.keywords = input.keywords;
  }

  return metadata;
}

/** Merge CMS SEO overrides with content fallbacks. */
export function resolveSeoCopy(
  seo: SanitySeoFields | null | undefined,
  fallback: { title: string; description: string },
): { title: string; description: string; noIndex: boolean } {
  return {
    title: seo?.title?.trim() || fallback.title,
    description: seo?.description?.trim() || fallback.description,
    noIndex: seo?.noIndex === true,
  };
}
