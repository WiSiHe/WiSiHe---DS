// app/sitemap.ts
import { getStaticSlugs } from '@/sanity/lib/queries';
import type { MetadataRoute } from 'next';

type SanityDocument = {
  slug: string;
  _updatedAt: string;
};

export const revalidate = 86400; // revalidate every 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.wisihe.no';

  // Static pages with appropriate change frequencies
  const staticPages = [
    { loc: '/', priority: 1, changeFrequency: 'daily' as const },
    { loc: '/paintings', priority: 0.9, changeFrequency: 'daily' as const },
    { loc: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { loc: '/interactive', priority: 0.8, changeFrequency: 'weekly' as const },
    { loc: '/recipes', priority: 0.8, changeFrequency: 'weekly' as const },
    { loc: '/videos', priority: 0.8, changeFrequency: 'weekly' as const },
    { loc: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  // Initialize the sitemap array with static pages
  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map(page => ({
    url: `${baseUrl}${page.loc}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    // Fetch dynamic slugs for paintings, projects, and recipes from Sanity
    const [allPaintings, allProjects, allRecipes] = await Promise.all([
      getStaticSlugs('painting'),
      getStaticSlugs('project'),
      getStaticSlugs('recipe'),
    ]);

    // Add dynamic paintings
    sitemapEntries.push(
      ...allPaintings.map((painting: SanityDocument) => ({
        url: `${baseUrl}/paintings/${painting.slug}`,
        lastModified: painting._updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    );

    // Add dynamic projects
    sitemapEntries.push(
      ...allProjects.map((project: SanityDocument) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project._updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    );

    // Add dynamic recipes
    sitemapEntries.push(
      ...allRecipes.map((recipe: SanityDocument) => ({
        url: `${baseUrl}/recipes/${recipe.slug}`,
        lastModified: recipe._updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Still return static pages if dynamic content fails
  }

  return sitemapEntries;
}
