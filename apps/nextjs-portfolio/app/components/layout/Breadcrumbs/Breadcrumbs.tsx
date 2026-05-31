import Link from 'next/link';
import { IoChevronForward } from 'react-icons/io5';

export interface Crumb {
  label: string;
  href?: string; // omit for the current (last) crumb
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className='flex items-center gap-1 text-sm text-foreground-muted mb-4 flex-wrap'
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.label} className='flex items-center gap-1'>
            {index > 0 && (
              <IoChevronForward className='w-3 h-3 text-foreground-muted/50 shrink-0' />
            )}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className='hover:text-foreground transition-colors duration-150'
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-foreground font-medium truncate max-w-[200px]' : ''}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
