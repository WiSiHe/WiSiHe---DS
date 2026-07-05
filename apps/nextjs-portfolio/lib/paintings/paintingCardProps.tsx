'use client';

import { IconBrandYoutube, IconMask, IconStack2 } from '@tabler/icons-react';
import type { PaintingCardBadge } from '@wisihe/ui-react';

export function parsePaintingYear(
  paintedAt: string | number | Date | null | undefined,
): string | undefined {
  if (!paintedAt) return undefined;

  if (typeof paintedAt === 'string') {
    if (paintedAt.includes('-')) {
      const d = new Date(paintedAt);
      if (!Number.isNaN(d.getTime())) {
        return d.getFullYear().toString();
      }
    }
    return paintedAt;
  }

  if (typeof paintedAt === 'number') {
    return paintedAt.toString();
  }

  if (paintedAt instanceof Date) {
    return paintedAt.getFullYear().toString();
  }

  return undefined;
}

export function buildPaintingCardBadges(options: {
  isFanArt?: boolean;
  imagesCount?: number;
  video?: string;
}): PaintingCardBadge[] {
  const badges: PaintingCardBadge[] = [];

  if (options.isFanArt === true) {
    badges.push({
      key: 'fanart',
      icon: <IconMask className='size-4' stroke={2} aria-hidden />,
      label: 'Fan art',
    });
  }

  if (Number(options.imagesCount) > 0) {
    badges.push({
      key: 'multi',
      icon: <IconStack2 className='size-4' stroke={2} aria-hidden />,
      label: 'Multiple images',
    });
  }

  if (options.video) {
    badges.push({
      key: 'video',
      icon: <IconBrandYoutube className='size-4' stroke={2} aria-hidden />,
      label: 'Has video',
    });
  }

  return badges;
}
