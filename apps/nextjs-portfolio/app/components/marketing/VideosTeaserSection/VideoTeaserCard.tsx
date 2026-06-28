'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { cleanTagName, cn } from '@wisihe/utils';
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/utils';
import { getVideoCategory, type VideoItem } from './videoTeaserShared';

const CARD_LINK_CLASS =
  'group block overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow,transform] duration-300 hover:border-accent/35 hover:shadow-lg';

type VideoTeaserLayout = 'stack' | 'cinema' | 'row';

type VideoTeaserCardProps = {
  video: VideoItem;
  index: number;
  className?: string;
  layout?: VideoTeaserLayout;
  /** @deprecated Use layout="cinema" */
  featuredLayout?: boolean;
};

function normalizeTagKey(value: string): string {
  return value.toLowerCase().replace(/[\s/_-]+/g, '');
}

function buildTagLabels(video: VideoItem): { category: string | null; tags: string[] } {
  const category = getVideoCategory(video)?.trim() || null;
  const tagNames = (video.tags ?? []).map(tag => cleanTagName(tag.name ?? '')).filter(Boolean);

  const seen = new Set<string>();
  if (category) seen.add(normalizeTagKey(category));

  const tags: string[] = [];
  for (const tag of tagNames) {
    const key = normalizeTagKey(tag);
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= 2) break;
  }

  return { category, tags };
}

function thumbnailSrc(
  thumbnailUrl: ReturnType<typeof urlForImage>,
  layout: VideoTeaserLayout,
): string | null {
  if (!thumbnailUrl) return null;

  if (layout === 'cinema') {
    return thumbnailUrl.width(1600).height(675).quality(85).url();
  }
  if (layout === 'row') {
    return thumbnailUrl.width(640).height(360).quality(80).url();
  }
  return thumbnailUrl.width(960).height(540).quality(80).url();
}

function PlayButton({ large = false }: { large?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110',
        large ? 'size-14 lg:size-16' : 'size-11 lg:size-12',
      )}
    >
      <IconPlayerPlay
        className={cn('text-white', large ? 'size-6 lg:size-7' : 'size-5')}
        fill='currentColor'
        aria-hidden
      />
    </div>
  );
}

function TagRow({
  category,
  tags,
  inverted = false,
}: {
  category: string | null;
  tags: string[];
  inverted?: boolean;
}) {
  if (!category && tags.length === 0) return null;

  const pillClass = inverted
    ? 'rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm'
    : 'rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent';

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {category ? <span className={pillClass}>{category}</span> : null}
      {tags.map(tag => (
        <span key={tag} className={pillClass}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function Thumbnail({
  video,
  title,
  index,
  src,
  aspectClass,
  sizes,
  playLarge,
  overlayTitle,
  category,
  tags,
}: {
  video: VideoItem;
  title: string;
  index: number;
  src: string | null;
  aspectClass: string;
  sizes: string;
  playLarge?: boolean;
  overlayTitle?: boolean;
  category: string | null;
  tags: string[];
}) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-neutral-950', aspectClass)}>
      {src ? (
        <Image
          src={src}
          alt={title}
          fill
          priority={index === 0}
          fetchPriority={index === 0 ? 'high' : undefined}
          sizes={sizes}
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
          placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
          blurDataURL={video.thumbnail?.lqip ?? undefined}
        />
      ) : (
        <div className='absolute inset-0 bg-linear-to-br from-surface-subtle via-surface to-surface-elevated' />
      )}

      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-black/10'
        aria-hidden
      />

      <div className='absolute inset-0 flex items-center justify-center'>
        <PlayButton large={playLarge} />
      </div>

      {video.featured ? (
        <span className='absolute right-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-contrast shadow-sm'>
          Featured
        </span>
      ) : null}

      {overlayTitle ? (
        <div className='absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8'>
          <h3 className='max-w-3xl font-sans text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-3xl'>
            {title}
          </h3>
          <div className='mt-3'>
            <TagRow category={category} tags={tags} inverted />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function VideoTeaserCard({
  video,
  index,
  className,
  layout,
  featuredLayout = false,
}: VideoTeaserCardProps) {
  const resolvedLayout: VideoTeaserLayout = layout ?? (featuredLayout ? 'cinema' : 'stack');
  const title = video.title?.trim() || 'Untitled video';
  const { category, tags } = buildTagLabels(video);
  const src = thumbnailSrc(urlForImage(video.thumbnail), resolvedLayout);

  if (resolvedLayout === 'cinema') {
    return (
      <Link
        href={`/videos/${video.slug}`}
        className={cn(CARD_LINK_CLASS, 'rounded-3xl', className)}
      >
        <Thumbnail
          video={video}
          title={title}
          index={index}
          src={src}
          aspectClass='aspect-21/9 max-h-[min(52vh,520px)]'
          sizes='100vw'
          playLarge
          overlayTitle
          category={category}
          tags={tags}
        />
      </Link>
    );
  }

  if (resolvedLayout === 'row') {
    return (
      <Link
        href={`/videos/${video.slug}`}
        className={cn(CARD_LINK_CLASS, 'flex flex-col sm:flex-row', className)}
      >
        <div className='relative aspect-video w-full shrink-0 sm:w-[42%] lg:w-[38%]'>
          <Thumbnail
            video={video}
            title={title}
            index={index}
            src={src}
            aspectClass='absolute inset-0 h-full'
            sizes='(min-width: 1024px) 30vw, 50vw'
            category={category}
            tags={tags}
          />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-2 border-t border-border px-4 py-4 sm:border-t-0 sm:border-l sm:py-5 sm:pl-5'>
          <h3 className='line-clamp-2 font-sans text-base font-semibold leading-snug text-foreground group-hover:text-accent lg:text-lg'>
            {title}
          </h3>
          <TagRow category={category} tags={tags} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/videos/${video.slug}`} className={cn(CARD_LINK_CLASS, className)}>
      <Thumbnail
        video={video}
        title={title}
        index={index}
        src={src}
        aspectClass='aspect-video'
        sizes='88vw'
        category={category}
        tags={tags}
      />
      <div className='border-t border-border px-3.5 py-3'>
        <h3 className='line-clamp-2 font-sans text-sm font-semibold leading-snug text-foreground group-hover:text-accent'>
          {title}
        </h3>
        <div className='mt-2'>
          <TagRow category={category} tags={tags} />
        </div>
      </div>
    </Link>
  );
}
