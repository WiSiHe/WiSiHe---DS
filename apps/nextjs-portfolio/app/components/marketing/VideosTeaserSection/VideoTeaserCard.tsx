'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { cleanTagName, cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';
import { getVideoCategory, type VideoItem } from './videoTeaserShared';

const CARD_LINK_CLASS =
  'group block overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-accent/35';

type VideoTeaserCardProps = {
  video: VideoItem;
  index: number;
  className?: string;
  /** Slightly larger title for the lead desktop placement */
  featuredLayout?: boolean;
};

export function VideoTeaserCard({
  video,
  index,
  className,
  featuredLayout = false,
}: VideoTeaserCardProps) {
  const title = video.title?.trim() || 'Untitled video';
  const category = getVideoCategory(video);
  const thumbnailUrl = urlForImage(video.thumbnail);
  const src = thumbnailUrl
    ? featuredLayout
      ? thumbnailUrl.width(1280).height(720).quality(85).url()
      : thumbnailUrl.width(960).height(540).quality(80).url()
    : null;

  const tagNames = (video.tags ?? []).map(tag => cleanTagName(tag.name ?? '')).filter(Boolean);

  const categoryLabel = category?.trim() || null;
  const visibleTags = tagNames
    .filter(tag => !categoryLabel || tag.toLowerCase() !== categoryLabel.toLowerCase())
    .slice(0, 3);

  return (
    <Link href={`/videos/${video.slug}`} className={cn(CARD_LINK_CLASS, className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-neutral-900',
          featuredLayout ? 'aspect-video lg:aspect-16/10' : 'aspect-video',
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : undefined}
            sizes={featuredLayout ? '60vw' : '88vw'}
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
            blurDataURL={video.thumbnail?.lqip ?? undefined}
          />
        ) : (
          <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
        )}

        <div
          className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent'
          aria-hidden
        />

        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className={cn(
              'flex items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110',
              featuredLayout ? 'size-14 lg:size-16' : 'size-12',
            )}
          >
            <IconPlayerPlay
              className={cn('text-white', featuredLayout ? 'size-6 lg:size-7' : 'size-5')}
              fill='currentColor'
              aria-hidden
            />
          </div>
        </div>

        {video.featured ? (
          <span className='absolute right-2.5 top-2.5 rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-contrast shadow-sm'>
            Featured
          </span>
        ) : null}
      </div>

      <div className='border-t border-border px-3.5 py-3'>
        <h3
          className={cn(
            'line-clamp-2 font-sans font-semibold leading-snug text-foreground group-hover:text-accent',
            featuredLayout ? 'text-base lg:text-lg' : 'text-sm',
          )}
        >
          {title}
        </h3>
        {(categoryLabel || visibleTags.length > 0) && (
          <div className='mt-2 flex flex-wrap items-center gap-1.5'>
            {categoryLabel ? (
              <span className='rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent'>
                {categoryLabel}
              </span>
            ) : null}
            {visibleTags.map(tag => (
              <span
                key={tag}
                className='rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
