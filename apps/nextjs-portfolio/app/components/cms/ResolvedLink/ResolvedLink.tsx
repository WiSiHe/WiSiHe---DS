'use client';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { linkResolver, type Link as SanityLink } from '@/sanity/lib/utils';

interface ResolvedLinkProps {
  link: SanityLink | undefined;
  children: React.ReactNode;
  className?: string;
}

const ResolvedLink = React.memo(function ResolvedLink({
  link,
  children,
  className,
}: ResolvedLinkProps) {
  // Memoize link resolution to avoid recalculating on every render
  const resolvedLink = useMemo(() => linkResolver(link), [link]);

  // Memoize link props - only create when resolvedLink is a string
  const linkProps = useMemo(() => {
    if (typeof resolvedLink !== 'string') {
      return null;
    }
    return {
      href: resolvedLink,
      target: link?.openInNewTab ? ('_blank' as const) : undefined,
      rel: link?.openInNewTab ? 'noopener noreferrer' : undefined,
      className,
    };
  }, [resolvedLink, link?.openInNewTab, className]);

  if (typeof resolvedLink === 'string' && linkProps) {
    return <Link {...linkProps}>{children}</Link>;
  }
  return <>{children}</>;
});

export default ResolvedLink;
