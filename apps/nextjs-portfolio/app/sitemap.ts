import { indexableContentSlugs } from '@wisihe/sanity-queries';
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/constants';
import { client } from '@/sanity/lib/client';

export const revalidate = 86400;

const CONTENT_PATH: Record<string, (slug: string) => string> = {
  painting: slug => `/paintings/${slug}`,
  project: slug => `/projects/${slug}`,
  recipe: slug => `/recipes/${slug}`,
  video: slug => `/videos/${slug}`,
  presentation: slug => `/presentations/${slug}`,
  photography: slug => `/photography/${slug}`,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily' as const, priority: 1, lastModified: new Date() },
    {
      url: `${SITE_URL}/paintings`,
      changeFrequency: 'daily' as const,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/recipes`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/videos`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/photography`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/presentations`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
      lastModified: new Date(),
    },
  ];

  try {
    const entries = await client
      .withConfig({ perspective: 'published', useCdn: true, stega: false })
      .fetch(indexableContentSlugs);

    const dynamicPages: MetadataRoute.Sitemap = (entries ?? [])
      .filter((entry: { _type?: string; slug?: string }) => entry._type && entry.slug)
      .map((entry: { _type: string; slug: string; _updatedAt?: string }) => ({
        url: `${SITE_URL}${CONTENT_PATH[entry._type]?.(entry.slug) ?? `/${entry.slug}`}`,
        lastModified: entry._updatedAt ? new Date(entry._updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: entry._type === 'painting' || entry._type === 'project' ? 0.7 : 0.6,
      }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
