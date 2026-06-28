'use client';

import type { ReactNode } from 'react';

export function ReferenceDisclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className='group mb-16 rounded-xl border border-border bg-surface/30 open:bg-surface/50'
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className='cursor-pointer list-none px-5 py-4 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden'>
        <span className='flex items-center justify-between gap-2'>
          {title}
          <span className='text-xs font-normal text-foreground-muted group-open:hidden'>Show</span>
          <span className='hidden text-xs font-normal text-foreground-muted group-open:inline'>
            Hide
          </span>
        </span>
      </summary>
      <div className='border-t border-border px-5 py-5'>{children}</div>
    </details>
  );
}
