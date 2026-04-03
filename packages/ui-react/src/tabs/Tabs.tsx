'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { cn } from '@wisihe/utils';
import { cva } from 'class-variance-authority';
import type * as React from 'react';

// ── CVA ───────────────────────────────────────────────────────────────────────

const tabListVariants = cva('flex', {
  variants: {
    variant: {
      underline: 'border-b border-border gap-0',
      pill: 'bg-muted p-1 rounded-lg gap-1',
    },
  },
  defaultVariants: { variant: 'underline' },
});

const tabVariants = cva(
  [
    'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        underline: [
          'px-4 py-2.5 -mb-px border-b-2 border-transparent text-muted-foreground',
          'hover:text-foreground hover:border-border',
          'data-selected:text-foreground data-selected:border-accent',
        ],
        pill: [
          'px-3 py-1.5 rounded-md text-muted-foreground',
          'hover:text-foreground hover:bg-background/60',
          'data-selected:bg-background data-selected:text-foreground data-selected:shadow-sm',
        ],
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

// ── Components ────────────────────────────────────────────────────────────────

export type TabsVariant = 'underline' | 'pill';

interface TabsRootProps extends React.ComponentProps<typeof TabGroup> {
  variant?: TabsVariant;
}

/** Context carrier — pass `variant` here and it flows to TabBar + TabItem via className helpers */
export function Tabs({ variant = 'underline', className, ...props }: Readonly<TabsRootProps>) {
  return <TabGroup className={cn('w-full', className)} {...props} />;
}

interface TabBarProps extends Omit<React.ComponentProps<typeof TabList>, 'className'> {
  variant?: TabsVariant;
  className?: string;
}

/**
 * Tab row. When multiple tab groups appear on one page, pass a distinct
 * `aria-label` (or `aria-labelledby`) so each tablist has an accessible name.
 */
export function TabBar({ variant = 'underline', className, ...props }: Readonly<TabBarProps>) {
  return <TabList className={cn(tabListVariants({ variant }), className)} {...props} />;
}

interface TabItemProps extends Omit<React.ComponentProps<typeof Tab>, 'className'> {
  variant?: TabsVariant;
  className?: string;
}

export function TabItem({ variant = 'underline', className, ...props }: Readonly<TabItemProps>) {
  return <Tab className={cn(tabVariants({ variant }), className)} {...props} />;
}

export function TabContent({ className, ...props }: React.ComponentProps<typeof TabPanels>) {
  return <TabPanels className={cn('mt-4', className)} {...props} />;
}

export function TabPanel_({ className, ...props }: React.ComponentProps<typeof TabPanel>) {
  return (
    <TabPanel
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
        className,
      )}
      {...props}
    />
  );
}

// Clean re-exports for the compound pattern
export { TabPanel_ as TabPanel };
