import { Input as HeadlessInput } from '@headlessui/react';
import { cn } from '@wisihe/utils';

import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const inputVariants = cva(
  [
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'hover:border-border',
        filled:
          'bg-muted border-transparent hover:bg-muted/80 focus-visible:bg-background focus-visible:border-ring',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref' | 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  className,
  type,
  variant,
  inputSize,
  leftIcon,
  rightIcon,
  ref,
  ...props
}: InputProps) {
  return (
    <div className='relative w-full'>
      {leftIcon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none'>
          {leftIcon}
        </div>
      )}
      <HeadlessInput
        type={type}
        className={cn(
          inputVariants({ variant, inputSize, className }),
          leftIcon && 'pl-9',
          rightIcon && 'pr-9',
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
      {rightIcon && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted'>
          {rightIcon}
        </div>
      )}
    </div>
  );
}
