import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@wisihe/utils';

const chipStyles = cva(
  'inline-flex items-center transition-all ease-in-out rounded-full gap-2 font-medium font-inter',
  {
    variants: {
      variation: {
        default: 'bg-stone-100 text-dark hover:bg-stone-200',
        primary: 'bg-primary text-white hover:bg-primary/40',
        secondary: 'bg-secondary text-white hover:bg-secondary/40',
        tertiary: 'bg-tertiary text-white hover:bg-tertiary/40',
        highlight: 'bg-highlight text-dark hover:bg-highlight/40',
      },
      outlined: {
        true: 'border border-current hover:bg-stone-50',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-offset-2 ring-primary bg-primary text-white hover:bg-primary/90',
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
  }
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
      className={cn(
        chipStyles({ variation, outlined, selected, iconPosition, size }),
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            iconSizeClasses[size],
            iconPosition === 'left' ? 'mr-2' : 'ml-2'
          )}
        />
      )}
      <span>
        {label} {additionalText}
      </span>
    </div>
  );
};

export default Chip;
