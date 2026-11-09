import { Field, Checkbox as HeadlessCheckbox, Label } from '@headlessui/react';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const checkboxVariants = cva(
  'group block size-5 rounded border bg-background data-checked:bg-accent transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-border-strong hover:border-accent data-checked:border-transparent',
        error: 'border-danger text-danger data-checked:border-transparent',
      },
      inputSize: {
        default: 'size-5 rounded',
        sm: 'size-4 rounded-sm',
        lg: 'size-6 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  },
);

export interface CheckboxProps
  extends Omit<React.ComponentProps<typeof HeadlessCheckbox>, 'className'>,
    VariantProps<typeof checkboxVariants> {
  className?: string;
  label?: string;
  labelClassName?: string;
}

export function Checkbox({
  className,
  variant,
  inputSize,
  label,
  labelClassName,
  ...props
}: CheckboxProps) {
  const checkbox = (
    <HeadlessCheckbox
      className={cn(
        checkboxVariants({ variant, inputSize }),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
      aria-invalid={props['aria-invalid'] ?? (variant === 'error' || undefined)}
      aria-label={label ? undefined : props['aria-label']}
    >
      <IconCheck
        className='size-full text-accent-contrast opacity-0 transition-opacity duration-200 group-data-checked:opacity-100 p-px'
        strokeWidth={3}
      />
    </HeadlessCheckbox>
  );

  if (label) {
    return (
      <Field className={cn('flex items-center gap-2', labelClassName)}>
        {checkbox}
        <Label className='cursor-pointer select-none text-sm text-foreground'>{label}</Label>
      </Field>
    );
  }

  return checkbox;
}
