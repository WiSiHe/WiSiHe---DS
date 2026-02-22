import React from 'react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinner = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    color: {
      primary: 'text-accent',
      secondary: 'text-foreground',
      accent: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      destructive: 'text-danger',
      muted: 'text-foreground-muted',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'color'>,
    VariantProps<typeof spinner> {
  children?: React.ReactNode;
}

export function Spinner({ className, size, color, children, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn(spinner({ size, color }), className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3.55556"
        />
      </g>
      {children}
    </svg>
  );
}
