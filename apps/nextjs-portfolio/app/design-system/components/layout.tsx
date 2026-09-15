import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Components — Design System',
  description: 'Interactive UI components, chips, buttons, and navigation patterns for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/components',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
