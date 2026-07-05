'use client';

import {
  type BreadcrumbCrumb,
  Breadcrumbs as UiBreadcrumbs,
  type BreadcrumbsProps as UiBreadcrumbsProps,
} from '@wisihe/ui-react';
import Link from 'next/link';

export type Crumb = BreadcrumbCrumb;

export type BreadcrumbsProps = Omit<UiBreadcrumbsProps, 'renderLink'>;

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <UiBreadcrumbs
      {...props}
      renderLink={({ href, className, children }) => (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
