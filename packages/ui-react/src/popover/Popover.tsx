'use client';

import { Popover as HeadlessPopover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { cn } from '@wisihe/utils';
import type * as React from 'react';

// ── Root ─────────────────────────────────────────────────────────────────────

export function Popover({ className, ...props }: React.ComponentProps<typeof HeadlessPopover>) {
  return <HeadlessPopover className={cn('relative inline-block', className)} {...props} />;
}

// ── Trigger ───────────────────────────────────────────────────────────────────

export { PopoverButton };

// ── Panel ─────────────────────────────────────────────────────────────────────

export interface PopoverContentProps extends React.ComponentProps<typeof PopoverPanel> {
  className?: string;
}

export function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <PopoverPanel
      transition
      anchor='bottom start'
      className={cn(
        'z-50 min-w-48 rounded-xl border border-border bg-surface-elevated p-1 shadow-floating',
        'text-sm text-foreground',
        'transition-all duration-150 ease-out origin-top',
        'data-enter:opacity-100 data-enter:scale-100',
        '[--anchor-gap:6px]',
        'data-leave:opacity-0 data-leave:scale-95',
        className,
      )}
      {...props}
    />
  );
}

// ── Item helper ───────────────────────────────────────────────────────────────

export function PopoverItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type='button'
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-foreground',
        'hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}
