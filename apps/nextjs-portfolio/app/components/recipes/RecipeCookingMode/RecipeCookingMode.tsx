'use client';

import { cn } from '@wisihe/utils';
import { TbChefHat } from 'react-icons/tb';
import { useWakeLock } from '@/hooks/useWakeLock';

type RecipeCookingModeProps = {
  className?: string;
};

/** Keeps the screen awake via the Screen Wake Lock API while cooking. */
export default function RecipeCookingMode({ className }: RecipeCookingModeProps) {
  const { isSupported, isActive, toggle } = useWakeLock();

  if (!isSupported) return null;

  return (
    <button
      type='button'
      onClick={() => void toggle()}
      aria-pressed={isActive}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        isActive
          ? 'border-accent/40 bg-accent/10 text-accent'
          : 'border-border bg-surface text-foreground-subtle hover:border-accent/30 hover:text-foreground',
        className,
      )}
    >
      <TbChefHat className={cn('size-4 shrink-0', isActive && 'text-accent')} aria-hidden />
      <span>Cooking mode</span>
      <span className='hidden text-xs font-normal text-foreground-muted sm:inline'>
        {isActive ? 'Screen stays on' : 'Keep screen on'}
      </span>
    </button>
  );
}
