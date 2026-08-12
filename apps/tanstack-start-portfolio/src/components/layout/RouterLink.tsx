import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type RouterLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  target?: string;
  rel?: string;
};

function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

export function RouterLink({
  href,
  className,
  children,
  'aria-label': ariaLabel,
  target,
  rel,
}: RouterLinkProps) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} aria-label={ariaLabel} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
