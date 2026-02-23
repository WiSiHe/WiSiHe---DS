import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

function LoadingIcon(): React.ReactElement {
  return (
    <svg
      className='animate-spin size-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='SVGRepo_bgCarrier' strokeWidth='0' />
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
      <g id='SVGRepo_iconCarrier'>
        <path
          d='M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612'
          stroke='currentColor'
          strokeLinecap='round'
          strokeWidth='3.55556'
        />
      </g>
    </svg>
  );
}

const button = cva('button', {
  variants: {
    variant: {
      primary: [
        'bg-accent',
        'text-accent-contrast',
        'border-transparent',
        'hover:bg-accent-hover',
        'stroke-accent-contrast',
      ],
      secondary: ['bg-surface', 'text-foreground', 'border-border', 'hover:bg-surface-hover'],
      tertiary: ['bg-transparent', 'text-accent', 'border-transparent', 'hover:bg-accent-subtle'],
      destructive: [
        'bg-danger',
        'text-danger-contrast',
        'border-transparent',
        'hover:bg-danger-text',
      ],
      success: [
        'bg-success',
        'text-success-contrast',
        'border-transparent',
        'hover:bg-success-text',
      ],
      accent: ['bg-accent', 'text-accent-contrast', 'border-transparent', 'hover:bg-accent-hover'],
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
}: ButtonProps) {
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
      type={type}
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
