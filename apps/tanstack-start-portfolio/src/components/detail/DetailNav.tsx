import { IconArrowLeft } from '@tabler/icons-react';
import { type BreadcrumbCrumb, Breadcrumbs } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { RouterLink } from '../layout/RouterLink';
import { renderBreadcrumbLink } from './breadcrumbLink';

type DetailNavProps = {
  backHref: string;
  backLabel: string;
  crumbs: BreadcrumbCrumb[];
  ariaLabel: string;
  className?: string;
};

const backLinkClass = cn(
  'mb-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-foreground-muted transition-colors duration-150',
  'hover:text-foreground',
  'focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

export function DetailNav({ backHref, backLabel, crumbs, ariaLabel, className }: DetailNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn('mx-auto mb-8 max-w-screen-2xl px-4 lg:px-8', className)}
    >
      <RouterLink href={backHref} className={backLinkClass}>
        <IconArrowLeft className='size-4 shrink-0' stroke={2} aria-hidden />
        {backLabel}
      </RouterLink>
      <Breadcrumbs crumbs={crumbs} renderLink={renderBreadcrumbLink} />
    </nav>
  );
}
