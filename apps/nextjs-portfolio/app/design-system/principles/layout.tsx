import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Principles — Design System',
  description: 'Design principles and shape language rules for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/principles',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
