import { IconCheck, IconX } from '@tabler/icons-react';
import type { ReactNode } from 'react';

export type DosDontItem = {
  label: string;
  hint?: string;
  do: ReactNode;
  dont: ReactNode;
};

function Column({ variant, children }: { variant: 'do' | 'dont'; children: ReactNode }) {
  const isDo = variant === 'do';

  return (
    <div className='min-w-0 flex-1'>
      <p
        className={`mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
          isDo ? 'text-success' : 'text-danger'
        }`}
      >
        {isDo ? (
          <IconCheck className='size-2.5' stroke={2} aria-hidden />
        ) : (
          <IconX className='size-2.5' stroke={2} aria-hidden />
        )}
        {isDo ? 'Do' : "Don't"}
      </p>
      <div
        className={`flex min-h-[5.5rem] items-center rounded-lg border p-4 ${
          isDo ? 'border-border bg-background' : 'border-danger/20 bg-danger/5'
        }`}
      >
        <div className='w-full'>{children}</div>
      </div>
    </div>
  );
}

export function DosDontGallery({
  title = 'Do & don\u2019t',
  description,
  items,
}: {
  title?: string;
  description?: string;
  items: DosDontItem[];
}) {
  return (
    <section className='mb-0 border-t border-border pt-12'>
      <div className='mb-6'>
        <h2 className='text-lg font-bold text-foreground'>{title}</h2>
        {description ? (
          <p className='mt-1 max-w-xl text-sm text-foreground-muted'>{description}</p>
        ) : null}
      </div>
      <div className='divide-y divide-border rounded-xl border border-border bg-surface/40'>
        {items.map(item => (
          <div key={item.label} className='p-4 md:p-5'>
            <div className='mb-3 flex items-baseline justify-between gap-2'>
              <span className='font-mono text-xs font-semibold text-foreground'>{item.label}</span>
              {item.hint ? (
                <span className='text-xs text-foreground-muted'>{item.hint}</span>
              ) : null}
            </div>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Column variant='do'>{item.do}</Column>
              <Column variant='dont'>{item.dont}</Column>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
