'use client';

import {
  DialogBackdrop,
  Description as DialogDescription,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from '@headlessui/react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const panelVariants = cva(
  [
    'relative w-full bg-background rounded-xl shadow-2xl border border-border',
    'transition-all duration-200 ease-out',
    'data-enter:opacity-100 data-enter:scale-100',
    'data-leave:opacity-0 data-leave:scale-95',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

// ── Root ─────────────────────────────────────────────────────────────────────

export interface DialogProps
  extends React.ComponentProps<typeof HeadlessDialog>,
    VariantProps<typeof panelVariants> {
  /** Show a close ✕ button in the top-right corner */
  showClose?: boolean;
  onClose: (value: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ size, showClose, children, className, ...props }: DialogProps) {
  return (
    <HeadlessDialog transition className='relative z-50 focus:outline-none' {...props}>
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-200 ease-out',
          'data-enter:opacity-100 data-leave:opacity-0',
        )}
      />

      {/* Centering container */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
        <DialogPanel className={cn(panelVariants({ size }), className)}>
          {showClose && (
            <button
              type='button'
              onClick={() => props.onClose(false)}
              className='absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              aria-label='Close dialog'
            >
              <IconX className='size-4' />
            </button>
          )}
          {children}
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

export function DialogHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 px-6 pt-6 pb-4', className)}>{children}</div>;
}

export { DialogDescription, DialogTitle };

export function DialogBody({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-4 text-sm text-foreground', className)}>{children}</div>;
}

export function DialogFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
