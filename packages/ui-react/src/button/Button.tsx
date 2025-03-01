import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

function LoadingIcon(): JSX.Element {
  return (
    <svg
      className="animate-spin size-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
        'bg-blue-900',
        'text-white',
        'border-transparent',
        'hover:bg-blue-600',
        'stroke-white',
      ],
      secondary: [
        'bg-white',
        'text-gray-800',
        'border-gray-400',
        'hover:bg-gray-100',
      ],
      tertiary: [
        'bg-transparent',
        'text-blue-900',
        'border-transparent',
        'hover:bg-blue-100',
      ],
      destructive: [
        'bg-red-900',
        'text-white',
        'border-transparent',
        'hover:bg-red-600',
      ],
      success: [
        'bg-green-900',
        'text-white',
        'border-transparent',
        'hover:bg-green-600',
      ],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4'],
      large: ['text-lg', 'py-3', 'px-6'],
      icon: ['p-2'],
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({
  className,
  variant,
  size,
  Icon,
  iconPosition,
  isLoading = false,
  isDisabled = false,
  children,
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'flex items-center gap-1 rounded-sm',
        button({
          variant,
          size,
          isDisabled: isLoading || isDisabled,
          className,
        })
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
