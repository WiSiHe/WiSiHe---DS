'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';
import { getVideoCategory, type VideoItem } from './videoTeaserShared';

type VideoTeaserCardProps = {
  video: VideoItem;
  index: number;
  className?: string;
  variant?: 'default' | 'featured';
  imageClassName?: string;
};

function thumbnailSrc(thumbnailUrl: ReturnType<typeof urlForImage>): string | null {
  if (!thumbnailUrl) return null;
  return thumbnailUrl.width(960).height(540).quality(80).url();
}

function featuredThumbnailSrc(thumbnailUrl: ReturnType<typeof urlForImage>): string | null {
  if (!thumbnailUrl) return null;
  return thumbnailUrl.width(1600).height(900).quality(85).url();
}

export function VideoTeaserCard({
  video,
  index,
  className,
  variant = 'default',
  imageClassName,
}: VideoTeaserCardProps) {
  const title = video.title?.trim() || 'Untitled video';
  const category = getVideoCategory(video);
  const isFeatured = variant === 'featured';
  const description = isFeatured ? video.description?.trim() : null;
  const src = isFeatured
    ? featuredThumbnailSrc(urlForImage(video.thumbnail))
    : thumbnailSrc(urlForImage(video.thumbnail));

  return (
    <article className={className}>
      <Link
        href={`/videos/${video.slug}`}
        className='group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
      >
        <div
          className={
            isFeatured
              ? 'relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-950 md:aspect-[21/9]'
              : 'relative aspect-video overflow-hidden rounded-xl bg-neutral-950'
          }
        >
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : undefined}
              sizes={
                isFeatured ? '100vw' : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 88vw'
              }
              className={imageClassName ?? 'object-cover'}
              placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
              blurDataURL={video.thumbnail?.lqip ?? undefined}
            />
          ) : (
            <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
          )}

          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75'
            aria-hidden
          />

          <div className='absolute inset-0 flex items-center justify-center'>
            <div
              className={
                isFeatured
                  ? 'flex size-14 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 md:size-16'
                  : 'flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:size-12'
              }
            >
              <IconPlayerPlay
                className='size-5 text-white md:size-6'
                fill='currentColor'
                aria-hidden
              />
            </div>
          </div>

          {category ? (
            <span className='absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm md:text-[10px]'>
              {category}
            </span>
          ) : null}
        </div>

        <h3
          className={
            isFeatured
              ? 'mt-4 px-1 text-left text-base font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent md:text-lg'
              : 'mt-2.5 px-1 text-center text-[13px] font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-accent sm:text-sm'
          }
        >
          {title}
        </h3>
        {description ? (
          <p className='mt-2 line-clamp-2 px-1 text-left text-sm leading-relaxed text-foreground-subtle'>
            {description}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
