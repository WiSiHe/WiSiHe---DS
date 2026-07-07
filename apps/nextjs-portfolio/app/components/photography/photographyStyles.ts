import { cn } from '@wisihe/utils';

/** Glass panel — matches painting detail sidebar. */
export const photographyGlassPanelClass = cn(
  'pointer-events-auto h-fit w-full min-w-0',
  'rounded-xl border border-border/30 p-5 ring-1 ring-white/10 sm:p-6',
  'bg-background/35 backdrop-blur-xl backdrop-saturate-[1.4]',
  'shadow-[0_12px_40px_rgba(0,0,0,0.06)]',
  'dark:bg-background/25 dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]',
  'dark:ring-white/5',
);

export const photographySectionLabelClass =
  'text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-muted';

export const photographyImageFrameClass = cn(
  'relative overflow-hidden bg-surface-subtle',
  'shadow-[0_24px_64px_rgba(0,0,0,0.12)] ring-1 ring-border/25',
  'dark:shadow-[0_24px_64px_rgba(0,0,0,0.45)]',
);
