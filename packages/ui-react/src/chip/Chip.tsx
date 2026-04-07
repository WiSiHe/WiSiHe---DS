import { IconX } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { useCallback, useMemo } from 'react';

const chipStyles = cva(
  'inline-flex items-center justify-center transition-all duration-200 ease-out rounded-full gap-1.5 font-medium font-inter relative overflow-hidden group',
  {
    variants: {
      variation: {
        default:
          'bg-surface-hover text-foreground border border-border hover:bg-surface hover:border-accent hover:shadow-sm active:scale-95',
        primary:
          'bg-accent text-accent-contrast hover:bg-accent-hover hover:shadow-md active:scale-95 shadow-sm',
        secondary:
          'bg-surface-hover text-foreground border border-border hover:bg-surface-active hover:border-accent hover:shadow-md active:scale-95 shadow-sm',
        tertiary:
          'bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-accent hover:shadow-sm active:scale-95',
        highlight:
          'bg-accent text-accent-contrast hover:bg-accent-hover hover:shadow-md active:scale-95 shadow-sm',
        success:
          'bg-success text-success-contrast hover:bg-success hover:opacity-90 hover:shadow-md active:scale-95 shadow-sm',
      },
      outlined: {
        true: 'border border-border bg-transparent hover:bg-surface hover:border-accent text-foreground hover:text-foreground active:scale-95',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-offset-2 ring-accent bg-accent text-accent-contrast hover:bg-accent-hover hover:shadow-lg active:scale-95 shadow-md',
        false: '',
      },
      iconPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
      size: {
        small: 'px-2.5 py-1 text-xs min-h-[24px]',
        medium: 'px-4 py-2 text-sm min-h-[32px]',
        large: 'px-5 py-2.5 text-base min-h-[40px]',
      },
      interactive: {
        true: 'cursor-pointer select-none',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variation: 'default',
      outlined: false,
      selected: false,
      iconPosition: 'left',
      size: 'medium',
      interactive: true,
    },
  },
);

const iconSizeClasses = {
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-5 h-5',
} as const;

export type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof chipStyles> & {
    label: string;
    selected?: boolean;
    Icon?: React.ElementType;
    iconPosition?: 'left' | 'right';
    variation?: 'primary' | 'secondary' | 'tertiary' | 'highlight' | 'success' | 'default';
    outlined?: boolean;
    size?: 'small' | 'medium' | 'large';
    additionalText?: string;
    className?: string;
    removable?: boolean;
    onRemove?: () => void;
    interactive?: boolean;
    disabled?: boolean;
  };

export function Chip({
  label,
  selected = false,
  Icon,
  iconPosition = 'left',
  variation = 'default',
  outlined = false,
  size = 'medium',
  additionalText,
  className,
  removable = false,
  onRemove,
  interactive = true,
  disabled = false,
  onClick,
  ...props
}: ChipProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      if (disabled || !interactive) return;
      onClick?.(e as React.MouseEvent<HTMLDivElement>);
    },
    [disabled, interactive, onClick],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
      if (disabled || !interactive) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const syntheticEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        onClick?.(syntheticEvent as unknown as React.MouseEvent<HTMLDivElement>);
      }
    },
    [disabled, interactive, onClick],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onRemove?.();
    },
    [disabled, onRemove],
  );

  const baseClassName = useMemo(
    () =>
      cn(
        chipStyles({
          variation,
          outlined,
          selected,
          iconPosition,
          size,
          interactive: interactive && !disabled,
        }),
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      ),
    [variation, outlined, selected, iconPosition, size, interactive, disabled, className],
  );

  const iconProps = useMemo(
    () =>
      Icon
        ? {
            className: cn(
              iconSizeClasses[size ?? 'medium'],
              'transition-transform duration-200 group-hover:scale-110',
              iconPosition === 'left' ? 'mr-0.5' : 'ml-0.5',
            ),
          }
        : null,
    [Icon, size, iconPosition],
  );

  const removeButtonClassName = useMemo(
    () =>
      cn(
        'relative z-10 ml-1 hover:bg-black/10 active:bg-black/20 rounded-full p-0.5 transition-all duration-200 hover:scale-110 active:scale-95',
        iconSizeClasses[size ?? 'medium'],
        disabled && 'pointer-events-none opacity-50',
      ),
    [size, disabled],
  );

  const iconElement =
    Icon && iconProps
      ? React.createElement(Icon, iconProps as React.ComponentProps<typeof Icon>)
      : null;

  const content = (
    <>
      {interactive && (
        <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none' />
      )}

      {iconElement}

      <span className='relative z-10 font-medium'>
        {label}
        {additionalText && <span className='ml-1 opacity-75'>{additionalText}</span>}
      </span>

      {removable && onRemove && (
        <button
          type='button'
          onClick={handleRemove}
          className={removeButtonClassName}
          aria-label={`Remove ${label}`}
          disabled={disabled}
        >
          <IconX className='w-full h-full' stroke={1.75} />
        </button>
      )}

      {removable && !onRemove && (
        <div
          className={cn('relative z-10 ml-1 rounded-full p-0.5', iconSizeClasses[size ?? 'medium'])}
        >
          <IconX className='w-full h-full opacity-30' stroke={1.75} />
        </div>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type='button'
        className={baseClassName}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={props['aria-label'] || label}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClassName} {...props}>
      {content}
    </div>
  );
}

Chip.displayName = 'Chip';
