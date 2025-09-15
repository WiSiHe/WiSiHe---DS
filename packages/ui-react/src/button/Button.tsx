import React from 'react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

function LoadingIcon(): React.ReactElement {
  return (
    <svg
      className="animate-spin size-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
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
    </svg>
  );
}

const button = cva('button', {
  variants: {
    variant: {
      primary: [
        'bg-primary-900',
        'text-surface-pure',
        'border-transparent',
        'hover:bg-primary-600',
        'stroke-surface-pure',
      ],
      secondary: [
        'bg-surface-pure',
        'text-text-primary',
        'border-border-default',
        'hover:bg-neutral-100',
      ],
      tertiary: [
        'bg-transparent',
        'text-primary-900',
        'border-transparent',
        'hover:bg-primary-100',
      ],
      destructive: [
        'bg-error-900',
        'text-surface-pure',
        'border-transparent',
        'hover:bg-error-600',
      ],
      success: [
        'bg-success-900',
        'text-surface-pure',
        'border-transparent',
        'hover:bg-success-600',
      ],
      accent: ['bg-accent-500', 'text-surface-pure', 'border-transparent', 'hover:bg-accent-600'],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2', 'h-8'],
      medium: ['text-base', 'py-2', 'px-4', 'h-10'],
      large: ['text-lg', 'py-3', 'px-6', 'h-12'],
      icon: ['p-2', 'h-10', 'w-10'],
    },
    isDisabled: {
      true: ['opacity-50', 'cursor-not-allowed'],
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'medium',
      class: 'uppercase',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  Icon?: React.ElementType | null;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  className,
  variant,
  size,
  Icon,
  iconPosition = 'left',
  isLoading = false,
  isDisabled = false,
  children,
  type = 'button',
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(
        'flex items-center gap-1 rounded-sm',
        button({
          variant,
          size,
          isDisabled: isLoading || isDisabled,
          className,
        }),
      )}
      disabled={isLoading || isDisabled}
      type={type === 'button' ? 'button' : 'submit'}
      {...props}
    >
      {Icon && iconPosition === 'left' ? <Icon /> : null}
      {isLoading ? <LoadingIcon /> : null}
      {children}
      {Icon && iconPosition === 'right' ? <Icon /> : null}
    </button>
  );
}

Button.displayName = 'Button';
