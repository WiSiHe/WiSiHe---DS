import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Motion — Design System',
  description: 'Easing curves, durations, and motion choreography for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/motion',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
