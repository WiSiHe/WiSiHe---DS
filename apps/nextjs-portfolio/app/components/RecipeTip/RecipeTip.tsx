'use client';

import { cn } from '@wisihe/utils';
import { TbBasket } from 'react-icons/tb';

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
  if (!tip || !tip.content) {
    return null;
  }

  return (
    <div
      className={cn(
        'p-6 rounded-xl bg-surface border border-border/30 hover:shadow-lg transition-all duration-200 flex items-start gap-4',
        className,
      )}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-accent-subtle text-accent-text">
        <TbBasket className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        {tip.title && (
          <h4 className="font-semibold text-lg mb-2 text-foreground">{tip.title}</h4>
        )}
        <p className="text-sm leading-relaxed text-foreground-subtle [&_a]:no-underline [&_*]:no-underline">
          {tip.content}
        </p>
      </div>
    </div>
  );
}
