import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  ElementType,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';

// --- Loading indicator (replaces optional Icon while isLoading) ---

function LoadingIcon(): ReactElement {
  return (
    <svg
      className='animate-spin size-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <g id='SVGRepo_bgCarrier' strokeWidth='0' />
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
      <g id='SVGRepo_iconCarrier'>
        <path
          d='M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9342 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612'
          stroke='currentColor'
          strokeLinecap='round'
          strokeWidth='3.55556'
        />
      </g>
    </svg>
  );
}

// --- Variants (Tailwind via CVA; consumers use their own theme tokens) ---

const button = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'w-fit max-w-full',
    'font-medium',
    'border',
    'rounded-xl',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none',
  ],
  {
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
        tertiary: [
          'bg-transparent',
          'text-accent',
          'border-transparent',
          'hover:bg-accent-subtle',
          'hover:text-accent-text',
        ],
        destructive: [
          'bg-danger',
          'text-danger-contrast',
          'border-transparent',
          'hover:bg-danger-hover',
        ],
        success: [
          'bg-success',
          'text-success-contrast',
          'border-transparent',
          'hover:bg-success-hover',
        ],
        accent: [
          'bg-accent',
          'text-accent-contrast',
          'border-transparent',
          'hover:bg-accent-hover',
        ],
      },
      size: {
        small: ['text-sm', 'px-3', 'h-9'],
        medium: ['text-sm', 'px-5', 'h-10'],
        large: ['text-base', 'px-6', 'h-12'],
        icon: ['p-2.5', 'h-10', 'w-10'],
      },
      isDisabled: {
        true: ['opacity-50', 'cursor-not-allowed'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

type ButtonOwnProps = {
  /** Optional icon component (shown alongside the loading spinner when `isLoading`). */
  Icon?: ElementType | null;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  /** Shows spinner and disables interaction. */
  isLoading?: boolean;
  /** Disabled styling + behavior (merged with native `disabled` from spread props). */
  isDisabled?: boolean;
} & VariantProps<typeof button>;

/**
 * Polymorphic button: default `<button>`, or pass `as` (e.g. Next.js `Link`) for the same styles on another element.
 * Inherits appropriate props from `as` (`href` for links, `ref` for React 19, etc.).
 */
export type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof ButtonOwnProps | 'as'>;

type ParsedRest = {
  userOnClick?: (e: MouseEvent) => void;
  typeProp?: 'button' | 'submit' | 'reset';
  nativeDisabled?: boolean;
  restProps: Record<string, unknown>;
};

/** Pulls `onClick`, `type`, and `disabled` out so we can apply consistent disabled + click handling. */
function parseRestProps(rest: unknown): ParsedRest {
  const {
    onClick: userOnClick,
    type: typeProp,
    disabled: nativeDisabled,
    ...restProps
  } = rest as {
    onClick?: (e: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    [key: string]: unknown;
  };
  return { userOnClick, typeProp, nativeDisabled, restProps };
}

type ButtonContentProps = {
  Icon?: ElementType | null;
  iconPosition: 'left' | 'right';
  isLoading: boolean;
  children?: ReactNode;
};

function ButtonContent({ Icon, iconPosition, isLoading, children }: Readonly<ButtonContentProps>) {
  return (
    <>
      {Icon && iconPosition === 'left' ? <Icon /> : null}
      {isLoading ? <LoadingIcon /> : null}
      {children}
      {Icon && iconPosition === 'right' ? <Icon /> : null}
    </>
  );
}

export function Button<T extends ElementType = 'button'>({
  as,
  className,
  variant,
  size,
  Icon,
  iconPosition = 'left',
  isLoading = false,
  isDisabled = false,
  children,
  ...rest
}: ButtonProps<T>) {
  const Component: ElementType = as ?? 'button';
  const isNativeButton = Component === 'button';

  const { userOnClick, typeProp, nativeDisabled, restProps } = parseRestProps(rest);

  const mergedClassName = cn(
    button({
      variant,
      size,
      isDisabled: isLoading || isDisabled || Boolean(nativeDisabled),
      className,
    }),
  );

  const disabled = Boolean(isLoading || isDisabled || nativeDisabled);

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    userOnClick?.(e);
  };

  const content = (
    <ButtonContent Icon={Icon} iconPosition={iconPosition} isLoading={isLoading}>
      {children}
    </ButtonContent>
  );

  if (isNativeButton) {
    return (
      <button
        {...(restProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        type={typeProp ?? 'button'}
        disabled={disabled}
        className={mergedClassName}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }

  return (
    <Component
      {...restProps}
      className={mergedClassName}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={handleClick}
    >
      {content}
    </Component>
  );
}

Button.displayName = 'Button';
