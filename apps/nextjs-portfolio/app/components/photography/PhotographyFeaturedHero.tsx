import { IconArrowUpRight } from '@tabler/icons-react';
import type { PhotographyListQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import { Link } from '@/app/components/layout/ProgressLink';
import {
  photographyImageFrameClass,
  photographySectionLabelClass,
} from '@/app/components/photography/photographyStyles';
import { urlForFullImage } from '@/sanity/lib/utils';

type PhotographyListItem = PhotographyListQueryResult[number];

type PhotographyFeaturedHeroProps = {
  photo: PhotographyListItem;
};

function formatPlaceLabel(photo: PhotographyListItem): string | null {
  const place = photo.place;
  if (place?.name && place.countryName) return `${place.name} · ${place.countryName}`;
  if (place?.name) return place.name;
  if (place?.countryName) return place.countryName;
  return null;
}

function getAspectRatio(photo: PhotographyListItem): number {
  const width = photo.image?.width;
  const height = photo.image?.height;
  if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
    return width / height;
  }

  const rawRatio = photo.image?.aspectRatio;
  return typeof rawRatio === 'number' && rawRatio > 0
    ? Math.min(1.85, Math.max(0.75, rawRatio))
    : 4 / 3;
}

export function PhotographyFeaturedHero({ photo }: PhotographyFeaturedHeroProps) {
  if (!photo.slug) return null;

  const imageUrl = photo.image
    ? urlForFullImage(photo.image)?.width(1800).quality(90).auto('format').url()
    : null;
  if (!imageUrl) return null;

  const placeLabel = formatPlaceLabel(photo);
  const aspectRatio = getAspectRatio(photo);

  return (
    <article className='relative grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12'>
      <Link
        href={`/photography/${photo.slug}`}
        className='group relative block'
        aria-label={photo.title ?? 'View featured photograph'}
      >
        <div className={cn(photographyImageFrameClass, 'rounded-2xl p-2 sm:p-3')}>
          <div
            className='relative overflow-hidden rounded-xl'
            style={{ aspectRatio: Math.min(aspectRatio, 16 / 9) }}
          >
            <Image
              src={imageUrl}
              alt={photo.image?.alt ?? photo.title ?? 'Featured photograph'}
              fill
              priority
              className='object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.03]'
              sizes='(max-width: 1024px) 100vw, 58vw'
              placeholder={photo.image?.lqip ? 'blur' : 'empty'}
              blurDataURL={photo.image?.lqip ?? undefined}
            />
            <div
              className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100'
              aria-hidden
            />
            <span className='absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md'>
              Featured
            </span>
          </div>
        </div>
      </Link>

      <div className='flex flex-col justify-center gap-5 border-l-0 pl-0 lg:border-l lg:border-border/40 lg:pl-10'>
        {placeLabel ? (
          <p className={photographySectionLabelClass}>{placeLabel}</p>
        ) : (
          <p className={photographySectionLabelClass}>Selected work</p>
        )}

        <h2 className='font-serif text-[2rem] font-bold leading-[1.08] tracking-tight text-foreground text-pretty sm:text-4xl lg:text-[2.65rem]'>
          {photo.title}
        </h2>

        {photo.caption ? (
          <p className='max-w-prose border-l-2 border-accent/35 pl-4 font-serif text-base italic leading-relaxed text-foreground-subtle text-pretty line-clamp-5'>
            {photo.caption}
          </p>
        ) : null}

        <Link
          href={`/photography/${photo.slug}`}
          className={cn(
            'group/link inline-flex w-fit items-center gap-2.5 rounded-full border border-border/60 bg-surface/50 px-5 py-2.5',
            'text-sm font-semibold text-foreground-subtle backdrop-blur-sm transition-all duration-200',
            'hover:border-accent/40 hover:bg-surface hover:text-foreground hover:shadow-md',
          )}
        >
          View photograph
          <IconArrowUpRight
            className='size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5'
            stroke={2}
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
