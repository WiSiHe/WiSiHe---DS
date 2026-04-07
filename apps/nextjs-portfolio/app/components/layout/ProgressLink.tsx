'use client';

import type NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { Link as ProgressLink } from 'react-transition-progress/next';

/**
 * A Link component that combines Next.js Link with react-transition-progress
 * to automatically show progress bars during navigation.
 */
export function Link({ children, href, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <ProgressLink href={href} {...props}>
      {children}
    </ProgressLink>
  );
}
