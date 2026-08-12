'use client';

import { memo, type ReactNode, useMemo } from 'react';
import { RouterLink } from '@/components/layout/RouterLink';
import { type Link, linkResolver } from '@/lib/linkResolver';

interface ResolvedLinkProps {
  link: Link;
  children: ReactNode;
  className?: string;
}

const ResolvedLink = memo(function ResolvedLink({ link, children, className }: ResolvedLinkProps) {
  const resolvedLink = useMemo(() => linkResolver(link), [link]);

  const linkProps = useMemo(() => {
    if (typeof resolvedLink !== 'string') return null;
    return {
      href: resolvedLink,
      target: link?.openInNewTab ? ('_blank' as const) : undefined,
      rel: link?.openInNewTab ? 'noopener noreferrer' : undefined,
      className,
    };
  }, [resolvedLink, link?.openInNewTab, className]);

  if (typeof resolvedLink === 'string' && linkProps) {
    return <RouterLink {...linkProps}>{children}</RouterLink>;
  }

  return <>{children}</>;
});

export default ResolvedLink;
