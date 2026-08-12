import { SITE_URL } from '../site';

export const AUTHOR = {
  name: 'Henrik Wilhelm Sissener',
  shortName: 'Henrik Sissener',
  url: SITE_URL,
} as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildPersonReference() {
  return {
    '@type': 'Person' as const,
    name: AUTHOR.name,
    url: AUTHOR.url,
  };
}
