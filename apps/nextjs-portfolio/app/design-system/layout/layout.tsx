import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layout & Spacing — Design System',
  description: 'Grid layout, container widths, and spacing scale for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/layout',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
