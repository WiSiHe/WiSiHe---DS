// app/sitemap.ts
import { getStaticSlugs } from '@/sanity/lib/queries';
import type { MetadataRoute } from 'next';

export const revalidate = 86400; // revalidate every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.wisihe.no';

  // Static pages
  const staticPages = [
    { loc: '/', priority: 1 },
    { loc: '/paintings', priority: 0.9 },
    { loc: '/projects', priority: 0.9 },
  ];

  // Fetch dynamic slugs for paintings and projects from Sanity
  const allPaintings = await getStaticSlugs('painting');
  const allProjects = await getStaticSlugs('project');

  // Construct the sitemap array
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages
  for (const page of staticPages) {
    sitemapEntries.push({
      url: `${baseUrl}${page.loc}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: page.priority,
    });
  }

  // Add dynamic paintings
  for (const paintingSlug of allPaintings) {
    sitemapEntries.push({
      url: `${baseUrl}/paintings/${paintingSlug.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // Add dynamic projects
  for (const projectSlug of allProjects) {
    sitemapEntries.push({
      url: `${baseUrl}/projects/${projectSlug.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  return sitemapEntries;
}
