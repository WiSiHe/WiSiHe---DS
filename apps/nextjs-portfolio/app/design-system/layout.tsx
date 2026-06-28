import type { Metadata } from 'next';
import DesignSystemShell from './components/DesignSystemShell';

export const metadata: Metadata = {
  title: 'Design System | WiSiHe',
  description:
    'Design guidelines, semantic colors, typography tokens, and Tone of Voice guidelines for the WiSiHe platform.',
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
