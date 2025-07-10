import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@wisihe/utils';
import { IoClose } from 'react-icons/io5';

const chipStyles = cva(
  'inline-flex items-center transition-all ease-in-out rounded-full gap-2 font-medium font-inter',
  {
    variants: {
      variation: {
        default:
          'bg-surface-elevated text-text-primary border border-border hover:bg-secondary-light hover:border-secondary',
        primary: 'bg-primary text-on-primary hover:bg-primary-light',
        secondary: 'bg-secondary text-on-primary hover:bg-secondary-light',
        tertiary: 'bg-surface text-text-primary border border-border hover:bg-surface-elevated',
        highlight: 'bg-accent text-text-primary hover:bg-accent-light',
      },
      outlined: {
        true: 'border border-border bg-transparent hover:bg-surface-elevated text-on-surface',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-offset-2 ring-primary bg-primary text-on-primary hover:bg-primary-light',
        false: '',
      },
      iconPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      },
      size: {
        small: 'px-2 py-0.5 text-xs',
        medium: 'px-3 py-1 text-base',
        large: 'px-4 py-2 text-lg',
      },
    },
    defaultVariants: {
      variation: 'primary',
      outlined: false,
      selected: false,
      iconPosition: 'left',
      size: 'medium',
    },
  },
);

type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof chipStyles> & {
    label: string;
    selected?: boolean;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    variation?: 'primary' | 'secondary' | 'tertiary' | 'highlight' | 'default';
    outlined?: boolean;
    size?: 'small' | 'medium' | 'large';
    additionalText?: string;
    className?: string;
    removable?: boolean;
    onRemove?: () => void;
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
  ...props
}) => {
  // Determine icon size based on chip size
  const iconSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <div
      className={cn(chipStyles({ variation, outlined, selected, iconPosition, size }), className)}
      {...props}
    >
      {Icon && (
        <Icon className={cn(iconSizeClasses[size], iconPosition === 'left' ? 'mr-2' : 'ml-2')} />
      )}
      <span>
        {label} {additionalText}
      </span>
      {removable && onRemove && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            'ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors',
            iconSizeClasses[size],
          )}
          aria-label={`Remove ${label}`}
        >
          <IoClose className="w-full h-full" />
        </button>
      )}
    </div>
  );
};

export default Chip;
