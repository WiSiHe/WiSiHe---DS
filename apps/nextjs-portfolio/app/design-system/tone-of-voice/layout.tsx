import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tone of Voice — Design System',
  description: 'Editorial guidelines, microcopy principles, and writing style for wisihe.no.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system/tone-of-voice',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
