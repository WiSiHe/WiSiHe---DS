import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

const skeletonVariants = cva('bg-surface-hover', {
  variants: {
    variant: {
      text: 'rounded-sm h-4 w-full',
      circular: 'rounded-full h-12 w-12',
      rectangular: 'rounded-md h-full w-full',
    },
    animation: {
      pulse: 'animate-pulse',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'rectangular',
    animation: 'pulse',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant, animation, ...props }: SkeletonProps) {
  return <div className={cn(skeletonVariants({ variant, animation }), className)} {...props} />;
}

Skeleton.displayName = 'Skeleton';
