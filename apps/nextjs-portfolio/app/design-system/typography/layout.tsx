import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typography — Design System',
  description: 'Typeface scales, font families, and responsive clamps for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/typography',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
