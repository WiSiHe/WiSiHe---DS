import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const textareaVariants = cva(
  [
    'flex w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
    'placeholder:text-muted-foreground resize-y min-h-20',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  ],
  {
    variants: {
      variant: {
        default: '',
        filled:
          'bg-muted border-transparent hover:bg-muted/80 focus-visible:bg-background focus-visible:border-ring',
      },
      state: {
        default: 'border-input hover:border-border focus-visible:ring-ring',
        error:
          'border-error-500 bg-error-50 hover:border-error-600 focus-visible:ring-error-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'ref'>,
    Omit<VariantProps<typeof textareaVariants>, 'state'> {
  /** Always required for accessibility. Use `hideLabel` to visually hide it. */
  label: string;
  /** Hides the label visually while keeping it readable by screen readers */
  hideLabel?: boolean;
  /** Optional helper text shown between the label and textarea */
  description?: string;
  /** Error message shown below the textarea; also applies error styling */
  errorMessage?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  className,
  variant,
  label,
  hideLabel,
  description,
  errorMessage,
  id,
  rows = 4,
  ref,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;
  const errorId = `${textareaId}-error`;

  const state = errorMessage ? 'error' : 'default';

  return (
    <div className='flex flex-col gap-1.5 w-full'>
      <label
        htmlFor={textareaId}
        className={cn(
          'text-sm font-medium leading-none text-foreground',
          hideLabel && 'sr-only',
        )}
      >
        {label}
      </label>

      {description && (
        <p id={descriptionId} className='text-xs text-muted-foreground'>
          {description}
        </p>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={cn(textareaVariants({ variant, state }), className)}
        ref={ref}
        aria-describedby={
          [errorMessage && errorId, description && descriptionId]
            .filter(Boolean)
            .join(' ') || undefined
        }
        aria-invalid={errorMessage ? true : undefined}
        {...props}
      />

      {errorMessage && (
        <p id={errorId} role='alert' className='text-xs font-medium text-error-700'>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
