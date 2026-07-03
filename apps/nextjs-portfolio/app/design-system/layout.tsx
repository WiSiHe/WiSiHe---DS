import type { Metadata } from 'next';
import DesignSystemShell from './components/DesignSystemShell';

export const metadata: Metadata = {
  title: 'Design System | WiSiHe',
  description:
    'Tokens, components, and patterns for wisihe.no — colors, type, layout, motion, and UI copy.',
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
