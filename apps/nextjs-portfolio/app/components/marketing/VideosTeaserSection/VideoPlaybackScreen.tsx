'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  getVideoCategory,
  getVideoDescription,
  getVideoHref,
  getVideoThumbnailSrc,
  getVideoTitle,
  type VideoItem,
} from './videoTeaserShared';

type VideoPlaybackScreenProps = {
  video: VideoItem;
  index: number;
  priority?: boolean;
  className?: string;
};

export default function VideoPlaybackScreen({
  video,
  index,
  priority = false,
  className,
}: VideoPlaybackScreenProps) {
  const title = getVideoTitle(video);
  const category = getVideoCategory(video);
  const description = getVideoDescription(video);
  const src = getVideoThumbnailSrc(video, 'screen');
  const href = getVideoHref(video.slug);

  return (
    <article className={cn('relative', className)}>
      <div className='overflow-hidden rounded-2xl bg-neutral-950 p-2.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65)] ring-1 ring-white/10 sm:p-3'>
        <div className='flex items-center justify-between gap-3 px-1 pb-2.5'>
          <span className='inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-red-400'>
            <span
              className='size-1.5 shrink-0 rounded-full bg-red-500 motion-safe:animate-pulse'
              aria-hidden
            />
            Rec
          </span>
          <span className='font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45'>
            Clip {String(index + 1).padStart(2, '0')}
          </span>
          {category ? (
            <span className='rounded-full border border-white/15 bg-white/8 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-white/80'>
              {category}
            </span>
          ) : (
            <span aria-hidden />
          )}
        </div>

        <Link
          href={href}
          className='group relative block aspect-video overflow-hidden rounded-lg bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
        >
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              priority={priority}
              fetchPriority={priority ? 'high' : 'auto'}
              sizes='(min-width: 1024px) 66vw, 100vw'
              className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
              placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
              blurDataURL={video.thumbnail?.lqip ?? undefined}
              draggable={false}
            />
          ) : (
            <div className='absolute inset-0 bg-linear-to-br from-neutral-800 via-neutral-900 to-neutral-950' />
          )}

          <div
            className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10'
            aria-hidden
          />

          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='flex size-14 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:size-16'>
              <IconPlayerPlay
                className='size-6 text-white sm:size-7'
                fill='currentColor'
                aria-hidden
              />
            </div>
          </div>

          <div
            className='pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay'
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)',
            }}
            aria-hidden
          />
        </Link>

        <div className='px-1 pt-3'>
          <h3 className='font-serif text-lg font-bold leading-snug text-white sm:text-xl'>
            {title}
          </h3>
          {description ? (
            <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-white/60'>{description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
