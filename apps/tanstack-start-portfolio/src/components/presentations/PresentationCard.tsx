import { IconPlayerPlay, IconPresentation } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { AllPresentationsQueryResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import Image from '@/components/ui/Image';
import { WORKSHOP_SLUG } from '@/lib/presentations/constants';
import { urlForImage } from '@/lib/sanity';

type PresentationListItem = AllPresentationsQueryResult[number];

type PresentationCardProps = {
  presentation: PresentationListItem;
  featured?: boolean;
  className?: string;
};

export function PresentationCard({
  presentation,
  featured = false,
  className,
}: PresentationCardProps) {
  const coverSrc = presentation.coverImage
    ? urlForImage(presentation.coverImage)?.width(900).height(560).quality(85).url()
    : null;
  const coverLqip =
    presentation.coverImage && typeof presentation.coverImage === 'object'
      ? (presentation.coverImage as { lqip?: string | null }).lqip
      : null;
  const coverAlt =
    presentation.coverImage && typeof presentation.coverImage === 'object'
      ? ((presentation.coverImage as { alt?: string | null }).alt ??
        presentation.title ??
        'Presentation cover')
      : (presentation.title ?? 'Presentation cover');

  const imageBlock = (
    <div
      className={cn(
        'relative block overflow-hidden bg-accent/10',
        featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[280px]' : 'aspect-[16/10]',
      )}
    >
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt={coverAlt}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          placeholder={coverLqip ? 'blur' : 'empty'}
          blurDataURL={coverLqip ?? undefined}
        />
      ) : (
        <div className='absolute inset-0 flex items-center justify-center text-accent/40'>
          <IconPresentation className='size-16' stroke={1.2} aria-hidden />
        </div>
      )}
      <div
        className='absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent'
        aria-hidden
      />
      {presentation.slug === WORKSHOP_SLUG ? (
        <span className='absolute top-4 left-4 rounded-full border border-accent/40 bg-background/85 px-3 py-1 text-[10px] font-semibold tracking-widest text-accent uppercase backdrop-blur-md'>
          3D Workshop
        </span>
      ) : null}
    </div>
  );

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/40 bg-surface transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5',
        featured && 'md:grid md:grid-cols-2',
        className,
      )}
    >
      {presentation.slug === WORKSHOP_SLUG ? (
        <Link to='/three-d' aria-label={presentation.title ?? 'View presentation'}>
          {imageBlock}
        </Link>
      ) : presentation.slug ? (
        <Link
          to='/presentations/$slug'
          params={{ slug: presentation.slug }}
          aria-label={presentation.title ?? 'View presentation'}
        >
          {imageBlock}
        </Link>
      ) : (
        imageBlock
      )}

      <div className={cn('flex flex-col gap-3 p-5', featured && 'md:justify-center md:p-8')}>
        <div className='space-y-2'>
          {presentation.slug === WORKSHOP_SLUG ? (
            <Link to='/three-d'>
              <h2
                className={cn(
                  'font-serif font-bold text-foreground transition-colors group-hover:text-accent',
                  featured ? 'text-2xl sm:text-3xl' : 'text-xl',
                )}
              >
                {presentation.title}
              </h2>
            </Link>
          ) : presentation.slug ? (
            <Link to='/presentations/$slug' params={{ slug: presentation.slug }}>
              <h2
                className={cn(
                  'font-serif font-bold text-foreground transition-colors group-hover:text-accent',
                  featured ? 'text-2xl sm:text-3xl' : 'text-xl',
                )}
              >
                {presentation.title}
              </h2>
            </Link>
          ) : (
            <h2
              className={cn(
                'font-serif font-bold text-foreground',
                featured ? 'text-2xl sm:text-3xl' : 'text-xl',
              )}
            >
              {presentation.title}
            </h2>
          )}
          {presentation.description ? (
            <p
              className={cn(
                'text-pretty leading-relaxed text-foreground-subtle',
                featured ? 'text-base' : 'line-clamp-3 text-sm',
              )}
            >
              {presentation.description}
            </p>
          ) : null}
        </div>

        <div className='flex flex-wrap items-center gap-3 text-xs text-foreground-muted'>
          {presentation.slidesCount ? <span>{presentation.slidesCount} slides</span> : null}
          <span className='inline-flex items-center gap-1 font-medium text-accent'>
            <IconPlayerPlay className='size-3.5' aria-hidden />
            Open deck
          </span>
        </div>

        {presentation.tags?.length ? (
          <div className='flex flex-wrap gap-2'>
            {presentation.tags
              .slice(0, 4)
              .map(tag =>
                tag.name ? (
                  <Chip key={tag._id} label={tag.name} size='small' interactive={false} />
                ) : null,
              )}
          </div>
        ) : null}
      </div>
    </article>
  );
}
