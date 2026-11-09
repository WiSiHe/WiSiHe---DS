import { Input as HeadlessInput } from '@headlessui/react';
import { cn } from '@wisihe/utils';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  [
    'flex w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  ],
  {
    variants: {
      variant: {
        default: '',
        filled:
          'bg-surface-subtle border-transparent hover:bg-surface-subtle/80 focus-visible:bg-background focus-visible:border-ring',
      },
      inputSize: {
        default: 'h-10',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: 'border-border-strong focus-visible:ring-ring',
        error: 'border-danger bg-danger-subtle hover:border-danger-hover focus-visible:ring-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
      state: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref' | 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'state'> {
  /**
   * Always required for accessibility.
   * Pass `hideLabel` to visually hide it while keeping it available to screen readers.
   */
  label: string;
  /** Hides the label visually (still readable by screen readers) */
  hideLabel?: boolean;
  /** Optional helper text shown between the label and input */
  description?: string;
  /** Error message shown below the input; also applies error border/bg styling */
  errorMessage?: string;
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
  label,
  hideLabel,
  description,
  errorMessage,
  id,
  ref,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const state = errorMessage ? 'error' : 'default';

  return (
    <div className='flex flex-col gap-1.5 w-full'>
      <label
        htmlFor={inputId}
        className={cn('text-sm font-medium leading-none text-foreground', hideLabel && 'sr-only')}
      >
        {label}
      </label>

      {description && (
        <p id={descriptionId} className='text-xs text-foreground-muted'>
          {description}
        </p>
      )}

      <div className='relative w-full'>
        {leftIcon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none'>
            {leftIcon}
          </div>
        )}
        <HeadlessInput
          id={inputId}
          type={type}
          className={cn(
            inputVariants({ variant, inputSize, state }),
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className,
          )}
          ref={ref}
          aria-describedby={
            [errorMessage && errorId, description && descriptionId].filter(Boolean).join(' ') ||
            undefined
          }
          aria-invalid={errorMessage ? true : undefined}
          suppressHydrationWarning
          {...props}
        />
        {rightIcon && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none'>
            {rightIcon}
          </div>
        )}
      </div>

      {errorMessage && (
        <p id={errorId} role='alert' className='text-xs font-medium text-danger-text'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
