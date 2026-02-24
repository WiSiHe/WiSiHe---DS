import type { Metadata } from 'next';
import TokyoPage from '@/app/components/Tokyo/TokyoPage';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function Tokyo() {
  return <TokyoPage />;
}
