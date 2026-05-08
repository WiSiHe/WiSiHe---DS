import type { Variants } from 'motion/react';

/**
 * Spring configuration for a "juicy" feel
 * High stiffness and damping for a snappy yet organic bounce
 */
export const springJuicy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
  mass: 1.2,
};

/**
 * Squash and Stretch tokens
 */
export const juiceVariants: Variants = {
  hover: {
    scale: 1.08,
    y: -2,
    transition: springJuicy,
  },
  tap: {
    scale: 0.94,
    y: 1,
    transition: { ...springJuicy, stiffness: 600 },
  },
};

/**
 * Navigation/List container variants
 */
export const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      ...springJuicy,
    },
  },
};

/**
 * Navigation/List item variants (Fly-in)
 */
export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springJuicy,
  },
};

/**
 * Page transition variants
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, x: -10, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, x: 10, filter: 'blur(4px)' },
};
