import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const tag = cva(
  'inline-flex items-center font-bold tracking-wider uppercase transition-colors select-none',
  {
    variants: {
      variant: {
        /** High contrast — default accent background */
        accent: 'bg-accent text-accent-contrast',
        /** Subtle fill — uses the surface token with a slight elevation */
        surface: 'bg-surface-elevated text-foreground border border-border',
        /** Transparent with a border */
        outline: 'bg-transparent border border-current text-foreground',
        /** Danger / warning states */
        danger: 'bg-danger text-danger-contrast',
        success: 'bg-success text-success-contrast',
        warning: 'bg-warning text-warning-contrast',
      },
      size: {
        sm: 'px-1.5 py-px text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      shape: {
        /** Slightly rounded — ideal for content labels */
        square: 'rounded-sm',
        /** Fully rounded — pill-style tag */
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'md',
      shape: 'square',
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tag> {
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * `Tag` — a compact, uppercase content-labelling chip.
 *
 * Unlike `Badge` (which is status-oriented and pill-shaped by default),
 * `Tag` is designed for categorisation labels (e.g. "Fantasy", "Store", "NSFW").
 */
export function Tag({ className, variant, size, shape, children, ...props }: TagProps) {
  return (
    <span className={cn(tag({ variant, size, shape }), className)} {...props}>
      {children}
    </span>
  );
}
