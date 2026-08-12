import { Link } from '@tanstack/react-router';
import { cn } from '@wisihe/utils';
import type { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn('mb-12 max-w-3xl', className)}>
      {eyebrow ? (
        <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent'>
          {eyebrow}
        </p>
      ) : null}
      <h1 className='text-4xl font-black tracking-tight text-foreground md:text-5xl'>{title}</h1>
      {description ? (
        <p className='mt-4 text-lg leading-relaxed text-foreground/70 text-pretty'>{description}</p>
      ) : null}
    </header>
  );
}

export function ContentCard({
  to,
  params,
  imageUrl,
  title,
  description,
  meta,
  children,
}: {
  to: string;
  params?: Record<string, string>;
  imageUrl?: string | null;
  title: string;
  description?: string | null;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Link
      to={to as '/'}
      params={params as never}
      className='group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:border-accent/50 hover:shadow-lg'
    >
      <div className='aspect-video overflow-hidden bg-surface-subtle'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            loading='lazy'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-foreground/30'>No image</div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-2 p-5'>
        <h2 className='text-xl font-bold transition-colors group-hover:text-accent'>{title}</h2>
        {description ? (
          <p className='line-clamp-2 text-sm text-foreground/60'>{description}</p>
        ) : null}
        {meta}
        {children}
      </div>
    </Link>
  );
}

export function NotFoundMessage({
  title = 'Not found',
  description = 'This page does not exist or was removed.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32 pb-20 text-center'>
      <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent'>
        404
      </p>
      <h1 className='mb-4 text-4xl font-black tracking-tight'>{title}</h1>
      <p className='mb-8 max-w-md text-foreground/70'>{description}</p>
      <a
        href='/'
        className='rounded-full bg-accent px-6 py-3 font-medium text-accent-contrast transition-opacity hover:opacity-90'
      >
        Back home
      </a>
    </div>
  );
}
