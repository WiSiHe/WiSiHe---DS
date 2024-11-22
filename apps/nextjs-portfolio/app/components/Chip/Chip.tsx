import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@wisihe/utils';

const chipStyles = cva('inline-flex items-center rounded-full font-medium', {
  variants: {
    variation: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-300 text-black',
    },
    outlined: {
      true: 'border border-current',
      false: '',
    },
    selected: {
      true: 'ring-2 ring-offset-2 ring-blue-500',
      false: '',
    },
    iconPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
    },
    size: {
      small: 'px-2 py-0.5 text-xs',
      medium: 'px-3 py-1 text-sm',
      large: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: {
    variation: 'primary',
    outlined: false,
    selected: false,
    iconPosition: 'left',
    size: 'medium',
  },
});

type ChipProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof chipStyles> & {
    label: string;
    selected?: boolean;
    Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    iconPosition?: 'left' | 'right';
    variation?: 'primary' | 'secondary';
    outlined?: boolean;
    size?: 'small' | 'medium' | 'large';
    additionalText?: string; // New prop
    className?: string;
  };

const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  Icon,
  iconPosition = 'left',
  variation = 'primary',
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
      <span>{label}</span>
      {additionalText && (
        <span className="ml-1 text-xs font-normal text-gray-600">
          {additionalText}
        </span>
      )}
    </div>
  );
};

export default Chip;
