'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Link from 'next/link';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';

type PhotographyDetailNavProps = {
  title: string;
  galleryHref: string;
};

const backLinkClass = cn(
  'mb-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-foreground-muted transition-colors duration-150',
  'hover:text-foreground',
  'focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export function PhotographyDetailNav({ title, galleryHref }: PhotographyDetailNavProps) {
  return (
    <nav
      aria-label='Photography navigation'
      className='mx-auto mb-8 max-w-screen-2xl px-4 lg:mb-10 lg:px-8'
    >
      <Link href={galleryHref} className={backLinkClass}>
        <IconArrowLeft className='size-4 shrink-0' stroke={2} aria-hidden />
        Back to gallery
      </Link>
      <Breadcrumbs
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Photography', href: galleryHref },
          { label: title },
        ]}
      />
    </nav>
  );
}
