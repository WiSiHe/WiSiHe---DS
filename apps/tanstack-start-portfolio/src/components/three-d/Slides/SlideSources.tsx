import { cn } from '@wisihe/utils';
import type { Source } from '@/lib/three-d/types';

interface SlideSourcesProps {
  sources: Source[];
  variant?: 'default' | 'compact';
}

export const SlideSources = ({ sources, variant = 'default' }: SlideSourcesProps) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div
      className={cn(
        'max-w-6xl mx-auto w-full border-t border-border/30',
        variant === 'compact' ? 'mt-6 md:mt-8 pt-6 md:pt-8' : 'mt-12 pt-8',
      )}
    >
      <p className='text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider'>
        Sources:
      </p>
      <ul className='space-y-2'>
        {sources.map((source, sourceIndex) => (
          <li key={sourceIndex} className='text-sm text-foreground/50 flex items-start'>
            <span className='mr-2 text-accent'>•</span>
            {source.url ? (
              <a
                href={source.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-accent hover:underline transition-colors'
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
};
