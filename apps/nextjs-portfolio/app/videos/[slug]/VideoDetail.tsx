'use client';

import { IconBrandYoutube, IconEye, IconHeart } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { SharedLayoutFrame } from '@/app/components/motion/SharedLayoutFrame';
import { formatCount } from '@/lib/youtube';
import VideoActions from './VideoActions';
import { VideoDetailNav } from './VideoDetailNav';

type LinkedPainting = {
  slug: string;
  title: string;
  imageUrl: string | null;
  blurDataURL: string | null;
};

type VideoDetailProps = {
  slug: string;
  videoId: string;
  title: string;
  description: string | null;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  videoUrl: string | null;
  youtubeVideoId: string | null;
  youtubeStats: { viewCount: number; likeCount: number } | null;
  linkedPainting: LinkedPainting | null;
};

const sidebarPanelClass = cn(
  'pointer-events-auto h-fit w-full min-w-0',
  'lg:rounded-xl lg:p-6',
  'lg:border lg:border-border/30 lg:ring-1 lg:ring-white/10 dark:lg:ring-white/5',
  'lg:bg-background/35 lg:backdrop-blur-xl lg:backdrop-saturate-[1.4]',
  'lg:shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
  'dark:lg:bg-background/25 dark:lg:shadow-[0_12px_40px_rgba(0,0,0,0.25)]',
);

export function VideoDetail({
  slug,
  videoId,
  title,
  description,
  tags,
  viewsCount,
  likesCount,
  videoUrl,
  youtubeVideoId,
  youtubeStats,
  linkedPainting,
}: VideoDetailProps) {
  return (
    <div className='relative z-10 overflow-visible pb-16 pt-32 md:pb-20 md:pt-36 lg:pt-40'>
      <VideoDetailNav title={title} />

      <section className='mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-8 px-4 lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:gap-y-8 lg:px-8 xl:gap-x-12'>
        <SharedLayoutFrame
          slug={slug}
          className='relative aspect-video w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-black shadow-2xl ring-1 ring-border/20 lg:col-start-1 lg:row-start-1'
        >
          {youtubeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0`}
              title={title}
              className='h-full w-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-foreground-muted'>
              <IconBrandYoutube className='size-16 opacity-30' stroke={2} aria-hidden />
            </div>
          )}
        </SharedLayoutFrame>

        {/* Sidebar — after video on mobile; sticky right column on desktop */}
        <aside className='min-w-0 lg:sticky lg:top-36 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start'>
          <div className={sidebarPanelClass}>
            <div className='flex flex-col gap-6'>
              <header className='space-y-3'>
                <h1 className='text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-2xl lg:text-[1.75rem]'>
                  {title}
                </h1>

                {tags.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className='rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground-subtle'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </header>

              <VideoActions
                videoId={videoId}
                title={title}
                viewsCount={viewsCount}
                likesCount={likesCount}
                layout='sidebar'
              />

              {youtubeStats ? (
                <dl className='divide-y divide-border/40 border-y border-border/40'>
                  <div className='flex items-baseline justify-between gap-4 py-2.5'>
                    <dt className='text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                      YouTube views
                    </dt>
                    <dd className='flex items-center gap-1.5 text-sm font-semibold text-foreground'>
                      <IconEye className='size-3.5' stroke={2} aria-hidden />
                      {formatCount(youtubeStats.viewCount)}
                    </dd>
                  </div>
                  <div className='flex items-baseline justify-between gap-4 py-2.5'>
                    <dt className='text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                      YouTube likes
                    </dt>
                    <dd className='flex items-center gap-1.5 text-sm font-semibold text-foreground'>
                      <IconHeart className='size-3.5' stroke={2} aria-hidden />
                      {formatCount(youtubeStats.likeCount)}
                    </dd>
                  </div>
                </dl>
              ) : null}

              {linkedPainting ? (
                <div className='space-y-3'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
                    Related painting
                  </p>
                  <Link href={`/paintings/${linkedPainting.slug}`} className='group block'>
                    <div className='overflow-hidden rounded-xl border border-border/60 transition-all duration-200 group-hover:border-accent-border group-hover:shadow-md'>
                      {linkedPainting.imageUrl ? (
                        <div className='relative aspect-[4/3] bg-surface-subtle'>
                          <Image
                            src={linkedPainting.imageUrl}
                            alt={linkedPainting.title}
                            fill
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                            placeholder={linkedPainting.blurDataURL ? 'blur' : 'empty'}
                            blurDataURL={linkedPainting.blurDataURL ?? undefined}
                            sizes='(max-width: 1024px) 100vw, 24vw'
                          />
                        </div>
                      ) : null}
                      <div className='p-3'>
                        <p className='text-sm font-medium text-foreground transition-colors group-hover:text-accent'>
                          {linkedPainting.title}
                        </p>
                        <p className='mt-0.5 text-xs text-foreground-muted'>View painting →</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ) : null}

              {videoUrl ? (
                <a
                  href={videoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5',
                    'text-sm font-semibold text-foreground-subtle transition-colors',
                    'hover:border-accent-border hover:bg-surface-hover hover:text-foreground',
                  )}
                >
                  <IconBrandYoutube className='size-4' stroke={2} aria-hidden />
                  Watch on YouTube
                </a>
              ) : null}
            </div>
          </div>
        </aside>

        {description ? (
          <div className='max-w-prose space-y-3 lg:col-start-1 lg:row-start-2'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
              About this video
            </h2>
            <p className='text-base leading-relaxed text-foreground-subtle'>{description}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
