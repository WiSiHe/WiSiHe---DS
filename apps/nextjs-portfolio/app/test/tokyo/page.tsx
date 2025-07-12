import TokyoPage from '@/app/components/Tokyo/TokyoPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function Tokyo() {
  return <TokyoPage />;
}
