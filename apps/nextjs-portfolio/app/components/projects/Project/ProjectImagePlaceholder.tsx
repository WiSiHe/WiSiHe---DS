import { IconPhotoOff } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';

type ProjectImagePlaceholderProps = {
  title?: string | null;
  className?: string;
  compact?: boolean;
};

export function ProjectImagePlaceholder({
  title,
  className,
  compact = false,
}: ProjectImagePlaceholderProps) {
  const initial = title?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-accent/10 via-surface-subtle to-surface text-center',
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-border/50 bg-surface/80 font-serif font-bold text-accent shadow-sm',
          compact ? 'size-14 text-xl' : 'size-20 text-3xl',
        )}
      >
        {initial}
      </div>
      <div className='space-y-1 px-6'>
        <IconPhotoOff
          className={cn('mx-auto text-foreground-muted', compact ? 'size-5' : 'size-6')}
          stroke={1.5}
          aria-hidden
        />
        <p className={cn('font-medium text-foreground-subtle', compact ? 'text-xs' : 'text-sm')}>
          No preview image
        </p>
      </div>
    </div>
  );
}
