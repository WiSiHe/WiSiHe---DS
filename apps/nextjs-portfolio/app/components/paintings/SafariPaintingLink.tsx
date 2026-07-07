'use client';

import { isSafariBrowser } from '@wisihe/ui-react';
import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { storeSafariPaintingMorph } from '@/lib/motion/safariPaintingMorph';

type SafariPaintingLinkProps = ComponentProps<typeof Link> & {
  paintingTitle: string;
  imageSrc?: string | null;
};

/** Captures card bounds before navigation for Safari manual shared-element morph. */
export function SafariPaintingLink({
  paintingTitle,
  imageSrc,
  onClick,
  ...props
}: SafariPaintingLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isSafariBrowser() && imageSrc) {
      const article = event.currentTarget.closest('article');
      if (article) {
        const rect = article.getBoundingClientRect();
        storeSafariPaintingMorph({
          title: paintingTitle,
          imageSrc,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
          borderRadius: 12,
        });
      }
    }

    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}
