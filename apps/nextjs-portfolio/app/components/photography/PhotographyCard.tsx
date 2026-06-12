import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import { urlForFullImage } from '@/sanity/lib/utils';

export type PhotographyListItem = PhotographyListQueryResult[number];

type PhotographyCardProps = {
  photo: PhotographyListItem;
  className?: string;
  priority?: boolean;
  size?: 'default' | 'large';
};

function formatPlaceLabel(photo: PhotographyListItem): string | null {
  const place = photo.place;
  if (place?.name && place.countryName) return `${place.name} · ${place.countryName}`;
  if (place?.name) return place.name;
  if (place?.countryName) return place.countryName;
  return null;
}

function getDisplayAspectRatio(photo: PhotographyListItem): number {
  const raw = photo.image?.aspectRatio;
  if (typeof raw === 'number' && raw > 0) {
    return Math.min(1.9, Math.max(0.62, raw));
  }
  return 4 / 3;
}

function getYear(capturedAt?: string | null): string | null {
  if (!capturedAt) return null;
  const date = new Date(capturedAt);
  if (Number.isNaN(date.getTime())) return null;
  return String(date.getFullYear());
}

export function PhotographyCard({
  photo,
  className,
  priority = false,
  size = 'default',
}: PhotographyCardProps) {
  if (!photo.slug) return null;

  const imageUrl = photo.image
    ? urlForFullImage(photo.image)?.width(1200).quality(88).auto('format').url()
    : null;
  if (!imageUrl) return null;

  const placeLabel = formatPlaceLabel(photo);
  const alt = photo.image?.alt ?? photo.title ?? 'Photograph';
  const aspectRatio = getDisplayAspectRatio(photo);
  const year = getYear(photo.capturedAt);

  return (
    <article className={cn('group', className)}>
      <Link
        href={`/photography/${photo.slug}`}
        className='block space-y-3.5'
        aria-label={photo.title ?? 'View photograph'}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl bg-surface/60 ring-1 ring-border/45 shadow-sm transition-all duration-500',
            'group-hover:ring-accent/35 group-hover:shadow-xl group-hover:shadow-black/[0.08]',
          )}
          style={{ aspectRatio }}
        >
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]'
            sizes={
              size === 'large'
                ? '(max-width: 1024px) 100vw, 66vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
            placeholder={photo.image?.lqip ? 'blur' : 'empty'}
            blurDataURL={photo.image?.lqip ?? undefined}
          />
          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            aria-hidden
          />
          {year ? (
            <span className='absolute left-3 top-3 rounded-md border border-white/20 bg-black/35 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-white backdrop-blur-md'>
              {year}
            </span>
          ) : null}
          {photo.isFeatured ? (
            <span className='absolute right-3 top-3 rounded-md border border-accent/40 bg-background/85 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent backdrop-blur-md'>
              Featured
            </span>
          ) : null}
        </div>

        <div className='px-0.5'>
          <h2
            className={cn(
              'font-serif font-bold leading-snug text-foreground text-pretty transition-colors group-hover:text-accent',
              size === 'large' ? 'text-2xl sm:text-[1.65rem]' : 'text-lg sm:text-xl',
            )}
          >
            {photo.title}
          </h2>
          {placeLabel ? (
            <p className='mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted'>
              {placeLabel}
            </p>
          ) : null}
          {photo.caption ? (
            <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-foreground-subtle text-pretty'>
              {photo.caption}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
