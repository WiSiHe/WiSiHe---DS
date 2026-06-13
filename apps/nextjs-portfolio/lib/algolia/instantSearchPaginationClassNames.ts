/** Shared Algolia InstantSearch pagination styles — paintings & projects search. */
export const instantSearchPaginationClassNames = {
  root: 'flex justify-center w-full',
  list: 'flex flex-wrap items-center justify-center gap-2',
  item: 'flex items-center',
  link: [
    'flex items-center justify-center',
    'min-h-11 min-w-11 px-3',
    'text-sm font-medium leading-none tabular-nums',
    'rounded-lg border border-border/70 bg-surface',
    'text-foreground-subtle shadow-sm',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-200',
    'hover:bg-surface-hover hover:text-foreground hover:border-border hover:shadow-md',
    'active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ].join(' '),
  selectedItem: [
    '[&_a]:bg-accent/12 [&_a]:border-accent/45 [&_a]:text-accent [&_a]:font-semibold [&_a]:shadow-md',
    '[&_a]:hover:bg-accent/16 [&_a]:hover:text-accent',
  ].join(' '),
  disabledItem: [
    'opacity-50',
    '[&_span]:cursor-not-allowed [&_span]:bg-surface/50 [&_span]:text-foreground-muted',
    '[&_span]:border-border/40 [&_span]:shadow-none',
    '[&_span]:hover:bg-surface/50 [&_span]:hover:text-foreground-muted [&_span]:hover:shadow-none',
  ].join(' '),
};
