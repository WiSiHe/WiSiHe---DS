import React from 'react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badge = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: [
          'border-transparent',
          'bg-primary-500',
          'text-surface-pure',
          'hover:bg-primary-600',
        ],
        secondary: [
          'border-transparent',
          'bg-secondary-500',
          'text-surface-pure',
          'hover:bg-secondary-600',
        ],
        destructive: [
          'border-transparent',
          'bg-error-500',
          'text-surface-pure',
          'hover:bg-error-600',
        ],
        success: [
          'border-transparent',
          'bg-success-500',
          'text-surface-pure',
          'hover:bg-success-600',
        ],
        warning: [
          'border-transparent',
          'bg-warning-500',
          'text-surface-pure',
          'hover:bg-warning-600',
        ],
        accent: ['border-transparent', 'bg-accent-500', 'text-surface-pure', 'hover:bg-accent-600'],
        outline: [
          'border-border-default',
          'bg-transparent',
          'text-text-primary',
          'hover:bg-neutral-100',
        ],
        'accent-warm': [
          'border-transparent',
          'bg-accent-warm-500',
          'text-surface-pure',
          'hover:bg-accent-warm-600',
        ],
        'accent-cool': [
          'border-transparent',
          'bg-accent-cool-500',
          'text-surface-pure',
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

export function Badge({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <div className={cn(badge({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
}
