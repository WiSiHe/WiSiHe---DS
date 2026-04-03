'use client';

import { motion } from 'motion/react';
import type * as React from 'react';
import { IconBadge, type IconBadgeProps } from '../icon-badge/IconBadge';

interface PaintingCardBadgeItemProps
  extends Pick<IconBadgeProps, 'variant' | 'size' | 'shape' | 'shadow'> {
  icon: React.ReactNode;
  label: string;
  /** Pinned badge: always visible, no motion animation */
  pinned?: boolean;
  /** When true, visible in parent `rest` for non-pinned badges (`PaintingCard` `alwaysShowTags`). */
  alwaysVisible?: boolean;
}

/**
 * Card-context wrapper around `IconBadge`.
 * - `pinned=true` — renders statically (always visible top-right corner)
 * - `pinned=false` — wraps in `motion.li`, animates in on hover via parent stagger
 */
export function PaintingCardBadgeItem({
  icon,
  label,
  pinned = false,
  alwaysVisible = false,
  variant,
  size,
  shape,
  shadow,
}: PaintingCardBadgeItemProps) {
  const badge = (
    <IconBadge
      icon={icon}
      label={label}
      variant={variant}
      size={size}
      shape={shape}
      shadow={shadow}
    />
  );

  if (pinned) {
    return badge;
  }

  return (
    <motion.li
      variants={{
        rest: alwaysVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 },
        hover: { opacity: 1, x: 0 },
      }}
    >
      {badge}
    </motion.li>
  );
}
