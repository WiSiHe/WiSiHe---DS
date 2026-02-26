'use client';

import { motion } from 'motion/react';
import { Tag, type TagProps } from '../tag/Tag';

interface PaintingCardTagProps extends Pick<TagProps, 'variant' | 'size' | 'shape'> {
  label: string;
}

/**
 * Animated wrapper around the generic `Tag` atom.
 * Inherits motion variants (rest/hover) from the parent `motion.ul`.
 */
export function PaintingCardTag({ label, variant, size, shape }: PaintingCardTagProps) {
  return (
    <motion.li
      variants={{
        rest: { opacity: 0, y: -10 },
        hover: { opacity: 1, y: 0 },
      }}
    >
      <Tag variant={variant} size={size} shape={shape}>
        {label}
      </Tag>
    </motion.li>
  );
}
