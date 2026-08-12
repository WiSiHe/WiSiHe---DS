'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { motion, type Variants } from 'motion/react';
import Image from '@/components/ui/Image';
import {
  getVideoCategory,
  getVideoThumbnailSrc,
  getVideoTitle,
  type VideoItem,
} from './videoTeaserShared';

type VideoPlaylistProps = {
  videos: VideoItem[];
  activeId: string;
  onSelect: (video: VideoItem) => void;
  className?: string;
  itemVariants?: Variants;
};

export default function VideoPlaylist({
  videos,
  activeId,
  onSelect,
  className,
  itemVariants,
}: VideoPlaylistProps) {
  if (videos.length === 0) return null;

  const ItemTag = itemVariants ? motion.li : 'li';

  return (
    <div className={className}>
      <p className='mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground-subtle'>
        Queue
      </p>
      <ul className='flex flex-col gap-2'>
        {videos.map((video, index) => {
          const isActive = video._id === activeId;
          const title = getVideoTitle(video);
          const category = getVideoCategory(video);
          const thumbSrc = getVideoThumbnailSrc(video, 'thumb');

          return (
            <ItemTag key={video._id} variants={itemVariants}>
              <button
                type='button'
                onClick={() => onSelect(video)}
                aria-pressed={isActive}
                aria-label={`Play preview: ${title}`}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors duration-200',
                  isActive
                    ? 'border-accent/40 bg-accent/8'
                    : 'border-border/60 bg-surface/50 hover:border-accent/25 hover:bg-surface',
                )}
              >
                <span
                  className={cn(
                    'shrink-0 font-mono text-[10px] font-bold tabular-nums tracking-wider',
                    isActive ? 'text-accent' : 'text-foreground-subtle',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className='min-w-0 flex-1'>
                  <p
                    className={cn(
                      'truncate text-sm font-semibold',
                      isActive ? 'text-foreground' : 'text-foreground group-hover:text-accent',
                    )}
                  >
                    {title}
                  </p>
                  {category ? (
                    <p className='mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-foreground-subtle'>
                      {category}
                    </p>
                  ) : null}
                </div>

                <div className='relative size-14 shrink-0 overflow-hidden rounded-md bg-neutral-900 ring-1 ring-border/40 sm:size-16'>
                  {thumbSrc ? (
                    <Image
                      src={thumbSrc}
                      alt=''
                      fill
                      sizes='64px'
                      className='object-cover'
                      placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
                      blurDataURL={video.thumbnail?.lqip ?? undefined}
                      draggable={false}
                    />
                  ) : null}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/25'>
                    <IconPlayerPlay
                      className={cn(
                        'size-3.5 text-white/90 transition-transform duration-200',
                        isActive && 'scale-110',
                      )}
                      fill='currentColor'
                      aria-hidden
                    />
                  </div>
                </div>
              </button>
            </ItemTag>
          );
        })}
      </ul>
    </div>
  );
}

export function FilmStripDivider() {
  return (
    <div className='flex items-center justify-center gap-1.5 py-1 opacity-25' aria-hidden>
      {Array.from({ length: 14 }).map((_, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: decorative static strip
          key={index}
          className='size-1.5 rounded-sm bg-foreground'
        />
      ))}
    </div>
  );
}
