import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/', '/api/', '/_next/', '/test/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'], // Block AI training crawlers
      },
    ],
    sitemap: 'https://www.wisihe.no/sitemap.xml',
    host: 'https://www.wisihe.no',
  };
}
