import React from 'react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const card = cva('rounded-lg border', {
  variants: {
    variant: {
      default: ['bg-surface', 'border-border', 'text-foreground'],
      elevated: ['bg-surface-subtle', 'border-border', 'text-foreground', 'shadow-md'],
      outlined: ['bg-transparent', 'border-border', 'text-foreground'],
      filled: ['bg-neutral-50', 'border-transparent', 'text-foreground'],
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  children?: React.ReactNode;
}

export function Card({ className, variant, padding, children, ...props }: CardProps) {
  return (
    <div className={cn(card({ variant, padding }), className)} {...props}>
      {children}
    </div>
  );
}

const cardHeader = cva('flex flex-col space-y-1.5', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3 pb-0',
      md: 'p-4 pb-0',
      lg: 'p-6 pb-0',
      xl: 'p-8 pb-0',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeader> {
  children?: React.ReactNode;
}

export function CardHeader({ className, padding, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn(cardHeader({ padding }), className)} {...props}>
      {children}
    </div>
  );
}

const cardTitle = cva('text-lg font-semibold leading-none tracking-tight', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitle> {
  children?: React.ReactNode;
}

export function CardTitle({ className, size, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn(cardTitle({ size }), className)} {...props}>
      {children}
    </h3>
  );
}

const cardDescription = cva('text-sm text-foreground-subtle', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescription> {
  children?: React.ReactNode;
}

export function CardDescription({ className, size, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn(cardDescription({ size }), className)} {...props}>
      {children}
    </p>
  );
}

const cardContent = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContent> {
  children?: React.ReactNode;
}

export function CardContent({ className, padding, children, ...props }: CardContentProps) {
  return (
    <div className={cn(cardContent({ padding }), className)} {...props}>
      {children}
    </div>
  );
}

const cardFooter = cva('flex items-center', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3 pt-0',
      md: 'p-4 pt-0',
      lg: 'p-6 pt-0',
      xl: 'p-8 pt-0',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooter> {
  children?: React.ReactNode;
}

export function CardFooter({ className, padding, children, ...props }: CardFooterProps) {
  return (
    <div className={cn(cardFooter({ padding }), className)} {...props}>
      {children}
    </div>
  );
}

// Compound component pattern
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
