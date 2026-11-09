'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import type { ReactNode } from 'react';

export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  crumbs: BreadcrumbCrumb[];
  className?: string;
  /** Framework-agnostic link renderer (e.g. Next.js `Link`). */
  renderLink?: (props: { href: string; className: string; children: ReactNode }) => ReactNode;
};

const crumbLinkClass = cn(
  'rounded-sm px-0.5 -mx-0.5 py-0.5 text-foreground-muted transition-colors duration-150',
  'hover:text-foreground hover:underline hover:underline-offset-4 hover:decoration-foreground/35',
  'focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4 focus-visible:decoration-foreground/35',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export function Breadcrumbs({ crumbs, className, renderLink }: BreadcrumbsProps) {
  if (!crumbs.length) return null;

  return (
    <nav aria-label='Breadcrumb' className={className}>
      <ol className='flex flex-wrap items-center gap-1 text-sm text-foreground-muted'>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const key = `${crumb.href ?? 'current'}-${crumb.label}-${index}`;

          return (
            <li key={key} className='flex min-w-0 items-center gap-1'>
              {index > 0 ? (
                <IconChevronRight
                  className='size-3 shrink-0 text-foreground-muted/50'
                  stroke={2}
                  aria-hidden
                />
              ) : null}
              {crumb.href && !isLast ? (
                renderLink ? (
                  renderLink({
                    href: crumb.href,
                    className: crumbLinkClass,
                    children: crumb.label,
                  })
                ) : (
                  <a href={crumb.href} className={crumbLinkClass}>
                    {crumb.label}
                  </a>
                )
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    isLast && 'max-w-[min(100%,28rem)] truncate font-medium text-foreground',
                  )}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
