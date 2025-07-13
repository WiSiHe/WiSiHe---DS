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
        'p-6 rounded-xl ring ring-accent-light hover:shadow-md transition-all duration-200 bg-surface flex items-center gap-4',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center">
          <TbBasket className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          {tip.title && (
            <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-accent)' }}>
              {tip.title}
            </h4>
          )}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {tip.content}
          </p>
        </div>
      </div>
    </div>
  );
}
