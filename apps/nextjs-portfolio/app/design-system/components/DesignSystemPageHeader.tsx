'use client';

import type { ReactNode } from 'react';

export function DesignSystemPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className='mb-12 max-w-2xl'>
      <h1 className='mb-3 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
        {title}
      </h1>
      <p className='text-base leading-relaxed text-foreground-subtle'>{description}</p>
      {children ? <div className='mt-5'>{children}</div> : null}
    </header>
  );
}
