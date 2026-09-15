import type { Metadata } from 'next';
import DesignSystemShell from './components/DesignSystemShell';

export const metadata: Metadata = {
  title: 'Design System | WiSiHe',
  description:
    'Tokens, components, and patterns for wisihe.no — colors, type, layout, motion, and UI copy.',
  alternates: {
    canonical: 'https://www.wisihe.no/design-system',
  },
  openGraph: {
    title: 'Design System | WiSiHe',
    description:
      'Tokens, components, and patterns for wisihe.no — colors, type, layout, motion, and UI copy.',
    url: 'https://www.wisihe.no/design-system',
  },
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
