import type { Metadata } from 'next';
import NotFoundSection from '@/app/components/layout/NotFound/NotFound';

export const metadata: Metadata = {
  title: 'Page not found',
  description: "This trail doesn't exist — head home or pick another destination on WiSiHe.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundSection />;
}
