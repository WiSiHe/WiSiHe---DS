import type { ReactNode } from 'react';
import { RouterLink } from '../layout/RouterLink';

export function renderBreadcrumbLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <RouterLink href={href} className={className}>
      {children}
    </RouterLink>
  );
}
