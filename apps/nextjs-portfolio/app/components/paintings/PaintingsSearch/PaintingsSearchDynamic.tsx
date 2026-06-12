'use client';

import dynamic from 'next/dynamic';
import PaintingsSearchSkeleton from './PaintingsSearchSkeleton';

const PaintingsSearch = dynamic(() => import('./PaintingsSearch'), {
  ssr: false,
  loading: () => <PaintingsSearchSkeleton />,
});

export default function PaintingsSearchDynamic() {
  return <PaintingsSearch />;
}
