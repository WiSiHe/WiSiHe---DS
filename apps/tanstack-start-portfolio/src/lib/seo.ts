import { SITE_DESCRIPTION_DEFAULT, SITE_NAME, SITE_TITLE_DEFAULT, SITE_URL } from './site';

export type PageMetaInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  imageUrl?: string | null;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile' | 'video.other';
  /** One or more JSON-LD objects — rendered via TanStack `script:ld+json` meta tags. */
  jsonLd?: unknown | unknown[];
};

export function buildHead(input: PageMetaInput = {}) {
  const title = input.title?.trim() || SITE_TITLE_DEFAULT;
  const description = input.description?.trim() || SITE_DESCRIPTION_DEFAULT;
  const url = input.path ? `${SITE_URL}${input.path}` : SITE_URL;
  const image = input.imageUrl || `${SITE_URL}/og-image.jpg`;
  const robots = input.noIndex ? 'noindex, nofollow' : 'index, follow';

  const meta: Array<Record<string, unknown>> = [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:image', content: image },
    ...(input.imageUrl
      ? []
      : [
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
        ]),
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];

  if (input.jsonLd) {
    const items = Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd];
    for (const item of items) {
      meta.push({ 'script:ld+json': item });
    }
  }

  return {
    meta,
    // Links are not de-duplicated across route matches, so only routes that set a path emit a canonical.
    links: input.path ? [{ rel: 'canonical', href: url }] : [],
  };
}
