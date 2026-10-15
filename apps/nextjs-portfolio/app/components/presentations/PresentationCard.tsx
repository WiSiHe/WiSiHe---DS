import { IconPlayerPlay, IconPresentation } from '@tabler/icons-react';
import type { AllPresentationsQueryResult } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForImage } from '@/sanity/lib/utils';

type PresentationListItem = AllPresentationsQueryResult[number];

const WORKSHOP_SLUG = 'houston-we-re-coding-3d';

export function PresentationCard({
  presentation,
  featured = false,
  className,
}: {
  presentation: PresentationListItem;
  featured?: boolean;
  className?: string;
}) {
  const href = `/presentations/${presentation.slug}`;
  const imageUrl = presentation.coverImage
    ? urlForImage(presentation.coverImage)?.width(900).height(560).quality(85).url()
    : null;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/40 bg-surface transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5',
        featured && 'md:grid md:grid-cols-2',
        className,
      )}
    >
      <Link
        href={href}
        className={cn(
          'relative block overflow-hidden bg-accent/10',
          featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[280px]' : 'aspect-[16/10]',
        )}
        aria-label={presentation.title ?? 'View presentation'}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={presentation.coverImage?.alt ?? presentation.title ?? 'Presentation cover'}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            placeholder={presentation.coverImage?.lqip ? 'blur' : 'empty'}
            blurDataURL={presentation.coverImage?.lqip ?? undefined}
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
          <span className='absolute left-4 top-4 rounded-full border border-accent/40 bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent backdrop-blur-md'>
            3D Workshop
          </span>
        ) : null}
      </Link>

      <div className={cn('flex flex-col gap-3 p-5', featured && 'md:justify-center md:p-8')}>
        <div className='space-y-2'>
          <Link href={href}>
            <h2
              className={cn(
                'font-serif font-bold text-foreground transition-colors group-hover:text-accent',
                featured ? 'text-2xl sm:text-3xl' : 'text-xl',
              )}
            >
              {presentation.title}
            </h2>
          </Link>
          {presentation.description ? (
            <p
              className={cn(
                'text-foreground-subtle text-pretty leading-relaxed',
                featured ? 'text-base' : 'text-sm line-clamp-3',
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
            {presentation.tags.slice(0, 4).map(tag => (
              <Chip key={tag._id} label={tag.name || ''} size='small' interactive={false} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
