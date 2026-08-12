import { createFileRoute } from '@tanstack/react-router';
import { ABOUT_PAGE_LINKS_ENABLED } from '@wisihe/constants';
import { SITE_URL } from '../lib/site';
import { getSitemapEntries } from '../server/fns';

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

const STATIC_PAGES: SitemapEntry[] = [
  { loc: SITE_URL, changefreq: 'daily', priority: 1, lastmod: new Date().toISOString() },
  {
    loc: `${SITE_URL}/paintings`,
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/projects`,
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/recipes`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/videos`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/photography`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/presentations`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/design-system`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/contact`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/privacy`,
    changefreq: 'yearly',
    priority: 0.4,
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/three-d`,
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
  ...(ABOUT_PAGE_LINKS_ENABLED
    ? [
        {
          loc: `${SITE_URL}/about`,
          changefreq: 'monthly' as const,
          priority: 0.7,
          lastmod: new Date().toISOString(),
        },
      ]
    : []),
];

function typeToPath(type: string, slug: string) {
  switch (type) {
    case 'painting':
      return `/paintings/${slug}`;
    case 'project':
      return `/projects/${slug}`;
    case 'video':
      return `/videos/${slug}`;
    case 'photography':
      return `/photography/${slug}`;
    case 'recipe':
      return `/recipes/${slug}`;
    case 'presentation':
      return slug === 'houston-we-re-coding-3d' ? '/three-d' : `/presentations/${slug}`;
    default:
      return null;
  }
}

function formatUrlEntry(entry: SitemapEntry): string {
  const lines = [`  <url>`, `    <loc>${entry.loc}</loc>`];
  if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority != null) lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  lines.push('  </url>');
  return lines.join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const entries = await getSitemapEntries();
        const dynamicPages: SitemapEntry[] = (entries ?? [])
          .filter((entry: { _type?: string; slug?: string }) => entry._type && entry.slug)
          .map((entry: { _type: string; slug: string; _updatedAt?: string }) => {
            const path = typeToPath(entry._type, entry.slug);
            if (!path) return null;
            return {
              loc: `${SITE_URL}${path}`,
              lastmod: entry._updatedAt
                ? new Date(entry._updatedAt).toISOString()
                : new Date().toISOString(),
              changefreq: 'monthly' as const,
              priority: entry._type === 'painting' || entry._type === 'project' ? 0.7 : 0.6,
            };
          })
          .filter((entry): entry is SitemapEntry => entry != null);

        const byLoc = new Map<string, SitemapEntry>();
        for (const page of [...STATIC_PAGES, ...dynamicPages]) {
          byLoc.set(page.loc, page);
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...byLoc.values()].map(formatUrlEntry).join('\n')}
</urlset>`;

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
