import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

const badge = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: [
          'border-transparent',
          'bg-accent',
          'text-accent-contrast',
          'hover:bg-accent-hover',
        ],
        secondary: [
          'border-transparent',
          'bg-surface-hover',
          'text-foreground',
          'hover:bg-surface-active',
        ],
        destructive: [
          'border-transparent',
          'bg-danger',
          'text-danger-contrast',
          'hover:bg-danger-text',
        ],
        success: [
          'border-transparent',
          'bg-success',
          'text-success-contrast',
          'hover:bg-success-text',
        ],
        warning: [
          'border-transparent',
          'bg-warning',
          'text-warning-contrast',
          'hover:bg-warning-text',
        ],
        accent: [
          'border-transparent',
          'bg-accent',
          'text-accent-contrast',
          'hover:bg-accent-hover',
        ],
        outline: ['border-border', 'bg-transparent', 'text-foreground', 'hover:bg-surface-hover'],
        'accent-warm': [
          'border-transparent',
          'bg-accent-warm-500',
          'text-foreground',
          'hover:bg-accent-warm-600',
        ],
        'accent-cool': [
          'border-transparent',
          'bg-accent-cool-500',
          'text-foreground',
          'hover:bg-accent-cool-600',
        ],
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badge> {
  children?: React.ReactNode;
}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badge({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
}
