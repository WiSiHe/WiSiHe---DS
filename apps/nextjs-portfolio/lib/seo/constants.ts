export const SITE_URL = 'https://www.wisihe.no';
export const SITE_NAME = 'WiSiHe';

export const AUTHOR = {
  name: 'Henrik Wilhelm Sissener',
  shortName: 'Henrik Sissener',
  url: SITE_URL,
} as const;

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'WiSiHe — digital art, design, and development portfolio',
} as const;
