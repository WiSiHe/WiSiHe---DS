import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Colors — Design System',
  description: 'Semantic color tokens and primitive scales for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/colors',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
