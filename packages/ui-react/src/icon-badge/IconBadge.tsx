import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const iconBadge = cva(
  'inline-flex items-center justify-center shrink-0 transition-colors',
  {
    variants: {
      variant: {
        /** Default accent colour */
        accent: 'bg-accent text-accent-contrast',
        /** Subtle surface — useful for secondary indicators */
        surface: 'bg-surface-elevated text-foreground',
        /** Transparent with a border */
        outline: 'border border-border bg-transparent text-foreground',
        success: 'bg-success text-success-contrast',
        danger:  'bg-danger text-danger-contrast',
        warning: 'bg-warning text-warning-contrast',
      },
      size: {
        sm: 'p-1 [&>svg]:w-3 [&>svg]:h-3',
        md: 'p-2 [&>svg]:w-4 [&>svg]:h-4',
        lg: 'p-3 [&>svg]:w-5 [&>svg]:h-5',
      },
      shape: {
        /** Slightly rounded — default for card badges */
        square: 'rounded-md',
        /** Fully rounded */
        circle: 'rounded-full',
      },
      shadow: {
        none: '',
        sm:   'shadow-sm',
        md:   'shadow-md',
      },
    },
    defaultVariants: {
      variant: 'accent',
      size:    'md',
      shape:   'square',
      shadow:  'sm',
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IconBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconBadge> {
  /** The icon to display */
  icon: React.ReactNode;
  /** Accessible label — rendered as aria-label on the wrapping span */
  label: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * `IconBadge` — a small icon container that follows the design system.
 *
 * Suitable for status/context badges wherever a labelled icon is needed
 * (e.g. "Available for sale", "NSFW", "Has video").
 *
 * The `role="img"` + `aria-label` pattern is used so screen readers
 * announce the badge's meaning without relying on the visual icon alone.
 */
export function IconBadge({
  className,
  variant,
  size,
  shape,
  shadow,
  icon,
  label,
  ...props
}: IconBadgeProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(iconBadge({ variant, size, shape, shadow }), className)}
      {...props}
    >
      {icon}
    </span>
  );
}
