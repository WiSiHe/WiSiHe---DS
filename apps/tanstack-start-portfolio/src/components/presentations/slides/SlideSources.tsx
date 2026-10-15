import { cn } from '@wisihe/utils';
import type { Source } from '@/lib/presentations/types';

type SlideSourcesProps = {
  sources: Source[];
  variant?: 'default' | 'compact';
};

export function SlideSources({ sources, variant = 'default' }: SlideSourcesProps) {
  if (!sources?.length) return null;

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-6xl border-t border-border/30',
        variant === 'compact' ? 'mt-6 pt-6 md:mt-8 md:pt-8' : 'mt-12 pt-8',
      )}
    >
      <p className='mb-4 text-sm font-semibold tracking-wider text-foreground/60 uppercase'>
        Sources:
      </p>
      <ul className='space-y-2'>
        {sources.map(source => (
          <li
            key={`${source.url ?? ''}|${source.text}`}
            className='flex items-start text-sm text-foreground/50'
          >
            <span className='mr-2 text-accent'>•</span>
            {source.url ? (
              <a
                href={source.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-accent transition-colors hover:underline'
              >
                {source.text}
              </a>
            ) : (
              <span>{source.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
