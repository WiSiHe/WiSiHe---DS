'use client';

import { IconBasket } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';

export interface RecipeTip {
  title?: string;
  content: string;
  icon?: string;
  type?: string;
}

interface RecipeTipProps {
  tip: RecipeTip;
  className?: string;
}

export default function RecipeTipComponent({ tip, className = '' }: RecipeTipProps) {
  if (!tip?.content) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-r-2xl border-l-4 border-accent bg-accent/5 p-5 transition-all duration-200',
        className,
      )}
    >
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent-text'>
        {tip.icon ? (
          <span className='text-lg' role='img' aria-label='Tip icon'>
            {tip.icon}
          </span>
        ) : (
          <IconBasket className='size-5' stroke={2} aria-hidden />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        {tip.title ? (
          <h4 className='mb-1 font-sans text-lg font-bold text-foreground'>{tip.title}</h4>
        ) : null}
        <p className='text-sm leading-relaxed text-foreground-subtle [&_*]:no-underline [&_a]:no-underline'>
          {tip.content}
        </p>
      </div>
    </div>
  );
}
