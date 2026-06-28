'use client';

import { cn } from '@wisihe/utils';
import { type ShapeScale, shapeLanguage } from '../layout-data';

const previewClass: Record<ShapeScale, { outer: string; inner: string; chip: string }> = {
  small: {
    outer: 'rounded-lg border border-border bg-surface p-2',
    inner: 'rounded-md bg-surface-subtle px-2 py-1 text-[10px] text-foreground-muted',
    chip: 'rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-medium text-accent',
  },
  medium: {
    outer: 'rounded-xl border border-border bg-surface/50 p-4',
    inner:
      'rounded-lg border border-border/60 bg-background px-3 py-2 text-xs text-foreground-subtle',
    chip: 'rounded-lg bg-accent/10 px-2 py-1 text-[10px] text-accent',
  },
  big: {
    outer:
      'rounded-2xl border border-border bg-surface/30 p-6 bg-linear-to-br from-accent/10 to-transparent',
    inner: 'rounded-xl border border-border/80 bg-surface/60 p-4 text-sm text-foreground-subtle',
    chip: 'rounded-xl bg-accent/15 px-3 py-1 text-xs font-medium text-accent',
  },
};

export function ShapeLanguagePreview({ scale }: { scale: ShapeScale }) {
  const p = previewClass[scale];
  const tier = shapeLanguage.find(row => row.scale === scale);
  if (!tier) return null;

  return (
    <div className={cn('w-full', p.outer)}>
      <p className='mb-3 font-mono text-[10px] uppercase tracking-wider text-accent'>
        {tier.label}
      </p>
      <div className={p.inner}>
        <span className={p.chip}>Example chip</span>
        <p className='mt-2 text-foreground'>Nested content block</p>
      </div>
    </div>
  );
}
