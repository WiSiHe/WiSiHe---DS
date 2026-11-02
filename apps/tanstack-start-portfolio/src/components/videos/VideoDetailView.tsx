'use client';

import { IconArrowLeft, IconArrowRight, IconBrandYoutube, IconEye } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { VideoBySlugQueryResult } from '@wisihe/sanity-queries';
import { cn } from '@wisihe/utils';
import { DetailNav } from '@/components/detail/DetailNav';
import { LikeButton } from '@/components/detail/LikeButton';
import { ShareButton } from '@/components/detail/ShareButton';
import { SharedLayoutFrame } from '@/components/motion/SharedLayoutFrame';
import Image from '@/components/ui/Image';
import { getYouTubeId } from '@/lib/youtube';
import { imageUrl } from '@/server/fns';

const sidebarPanelClass = cn(
  'h-fit w-full min-w-0 lg:rounded-xl lg:border lg:border-border/30 lg:bg-background/35 lg:p-6 lg:backdrop-blur-xl',
  'lg:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:lg:bg-background/25',
);

type VideoDetailViewProps = {
  video: NonNullable<VideoBySlugQueryResult>;
  prevSlug: string | null;
  nextSlug: string | null;
};

export function VideoDetailView({ video, prevSlug, nextSlug }: VideoDetailViewProps) {
  const youtubeId = getYouTubeId(video.videoUrl);
  const tags = (video.tags ?? [])
    .map((tag: { name?: string | null }) => tag.name?.trim())
    .filter(Boolean) as string[];

  return (
    <div className='relative z-10 overflow-visible pb-16 pt-32 md:pb-20 md:pt-36 lg:pt-40'>
      <DetailNav
        backHref='/videos'
        backLabel='Back to videos'
        ariaLabel='Video navigation'
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Videos', href: '/videos' },
          { label: video.title ?? 'Video' },
        ]}
      />

      {(prevSlug || nextSlug) && (
        <div className='mx-auto mb-6 flex max-w-screen-2xl justify-end gap-2 px-4 lg:px-8'>
          {prevSlug ? (
            <Link
              to='/videos/$slug'
              params={{ slug: prevSlug }}
              className='inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-foreground-muted hover:text-accent'
            >
              <IconArrowLeft className='size-4' stroke={2} aria-hidden /> Previous
            </Link>
          ) : null}
          {nextSlug ? (
            <Link
              to='/videos/$slug'
              params={{ slug: nextSlug }}
              className='inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-foreground-muted hover:text-accent'
            >
              Next <IconArrowRight className='size-4' stroke={2} aria-hidden />
            </Link>
          ) : null}
        </div>
      )}

      <section className='mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-x-6 gap-y-8 px-4 lg:grid-cols-[minmax(0,1fr)_clamp(17.5rem,30vw,24rem)] lg:gap-x-10 lg:px-8 xl:gap-x-12'>
        <SharedLayoutFrame
          slug={typeof video.slug === 'string' ? video.slug : ''}
          className='relative aspect-video w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-black shadow-2xl ring-1 ring-border/20'
        >
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={video.title}
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

        <aside className='min-w-0 lg:sticky lg:top-36 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start'>
          <div className={sidebarPanelClass}>
            <div className='flex flex-col gap-6'>
              <header className='space-y-3'>
                <h1 className='text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight sm:text-2xl lg:text-[1.75rem]'>
                  {video.title}
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

              <div className='flex flex-wrap items-center gap-3'>
                <span className='inline-flex items-center gap-1.5 text-sm text-foreground-muted'>
                  <IconEye className='size-4' stroke={2} aria-hidden />
                  {video.viewsCount ?? 0} views
                </span>
                <LikeButton
                  kind='video'
                  documentId={video._id}
                  title={video.title ?? 'Video'}
                  likesCount={video.likesCount}
                />
                <ShareButton title={video.title ?? 'Video'} />
              </div>

              {video.linkedPainting?.slug ? (
                <div className='space-y-3'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
                    Related painting
                  </p>
                  <Link
                    to='/paintings/$slug'
                    params={{ slug: video.linkedPainting.slug }}
                    className='group block overflow-hidden rounded-xl border border-border/60 transition-all hover:border-accent-border hover:shadow-md'
                  >
                    {video.linkedPainting.image ? (
                      <div className='relative aspect-[4/3] bg-surface-subtle'>
                        <Image
                          src={imageUrl(video.linkedPainting.image, 400) || ''}
                          alt={video.linkedPainting.title}
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                          sizes='280px'
                        />
                      </div>
                    ) : null}
                    <div className='p-3'>
                      <p className='text-sm font-medium transition-colors group-hover:text-accent'>
                        {video.linkedPainting.title}
                      </p>
                      <p className='mt-0.5 text-xs text-foreground-muted'>View painting →</p>
                    </div>
                  </Link>
                </div>
              ) : null}

              {video.videoUrl ? (
                <a
                  href={video.videoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground-subtle transition-colors hover:border-accent-border hover:text-foreground'
                >
                  <IconBrandYoutube className='size-4' stroke={2} aria-hidden />
                  Watch on YouTube
                </a>
              ) : null}
            </div>
          </div>
        </aside>

        {video.description ? (
          <div className='max-w-prose space-y-3 lg:col-start-1 lg:row-start-2'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-foreground-muted'>
              About this video
            </h2>
            <p className='text-base leading-relaxed text-foreground-subtle'>{video.description}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
