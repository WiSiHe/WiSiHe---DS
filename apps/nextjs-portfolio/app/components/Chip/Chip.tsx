import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@wisihe/utils';
import { IoClose } from 'react-icons/io5';

const chipStyles = cva(
  'inline-flex items-center justify-center transition-all duration-200 ease-out rounded-full gap-1.5 font-medium font-inter relative overflow-hidden group',
  {
    variants: {
      variation: {
        default:
          'bg-surface-elevated text-text-primary border border-border hover:bg-surface hover:border-accent hover:shadow-sm active:scale-95',
        primary:
          'bg-primary text-on-primary hover:bg-primary-dark hover:shadow-md active:scale-95 shadow-sm',
        secondary:
          'bg-secondary text-on-primary hover:bg-secondary-dark hover:shadow-md active:scale-95 shadow-sm',
        tertiary:
          'bg-surface text-text-primary border border-border hover:bg-surface-elevated hover:border-accent hover:shadow-sm active:scale-95',
        highlight:
          'bg-accent text-text-primary hover:bg-accent-dark hover:shadow-md active:scale-95 shadow-sm',
        success:
          'bg-success text-on-primary hover:bg-accent-success hover:shadow-md active:scale-95 shadow-sm',
      },
      outlined: {
        true: 'border-2 border-border bg-transparent hover:bg-surface hover:border-accent text-text-primary hover:text-text-primary active:scale-95',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-offset-2 ring-primary bg-primary text-on-primary hover:bg-primary-dark hover:shadow-lg active:scale-95 shadow-md',
        false: '',
      },
      iconPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
      size: {
        small: 'px-2.5 py-1 text-xs min-h-[24px]',
        medium: 'px-3.5 py-1.5 text-sm min-h-[32px]',
        large: 'px-4.5 py-2 text-base min-h-[40px]',
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

type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof chipStyles> & {
    label: string;
    selected?: boolean;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
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

const Chip: React.FC<ChipProps> = ({
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
}) => {
  // Determine icon size based on chip size
  const iconSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  // Enhanced click handler with proper event handling
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !interactive) return;
    onClick?.(e);
  };

  // Enhanced remove handler
  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    onRemove?.();
  };

  return (
    <div
      className={cn(
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
      )}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      aria-pressed={selected}
      aria-disabled={disabled}
      {...props}
    >
      {/* Subtle background animation on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      {Icon && (
        <Icon
          className={cn(
            iconSizeClasses[size],
            'transition-transform duration-200 group-hover:scale-110',
            iconPosition === 'left' ? 'mr-0.5' : 'ml-0.5',
          )}
        />
      )}

      <span className="relative z-10 font-medium">
        {label}
        {additionalText && <span className="ml-1 opacity-75">{additionalText}</span>}
      </span>

      {removable && onRemove && (
        <button
          onClick={handleRemove}
          className={cn(
            'relative z-10 ml-1 hover:bg-black/10 active:bg-black/20 rounded-full p-0.5 transition-all duration-200 hover:scale-110 active:scale-95',
            iconSizeClasses[size],
            disabled && 'pointer-events-none opacity-50',
          )}
          aria-label={`Remove ${label}`}
          disabled={disabled}
        >
          <IoClose className="w-full h-full" />
        </button>
      )}

      {/* If removable is true but no onRemove function, show a visual indicator but make it clickable */}
      {removable && !onRemove && (
        <div className={cn('relative z-10 ml-1 rounded-full p-0.5', iconSizeClasses[size])}>
          <IoClose className="w-full h-full opacity-30" />
        </div>
      )}
    </div>
  );
};

export default Chip;
