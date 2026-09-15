import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iconography — Design System',
  description: 'Tabler icon styling, sizes, and icon usage rules for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/iconography',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
