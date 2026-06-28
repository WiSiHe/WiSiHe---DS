'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { urlForImage } from '@/sanity/lib/utils';

type VideoItem = {
  _id: string;
  slug: string | null;
  title: string | null;
  featured?: boolean | null;
  description?: string | null;
  videoUrl?: string | null;
  tags?: { name: string | null }[] | null;
  thumbnail?: { asset?: { _ref: string }; lqip?: string | null } | null;
  linkedPainting?: {
    _id: string;
    slug: string | null;
    title: string | null;
    image?: { asset?: { _ref: string }; lqip?: string | null } | null;
  } | null;
};

// Category definitions — map tag names to a display category
const CATEGORY_MAP: Record<string, string> = {
  'Time-lapse': 'Timelapse',
  Animation: 'Animation',
  Rotoscope: 'Animation',
  'Unreal Engine 4': '3D / UE4',
  'Unreal Engine 5': '3D / UE4',
  Game: 'Game Dev',
  Unity: 'Game Dev',
  Flash: 'Game Dev',
  Babel: 'Game Dev',
};

function getCategory(video: VideoItem): string {
  for (const tag of video.tags ?? []) {
    const cat = CATEGORY_MAP[tag.name ?? ''];
    if (cat) return cat;
  }
  return 'Other';
}

const ALL_CATEGORIES = ['All', 'Timelapse', 'Animation', '3D / UE4', 'Game Dev'];

interface VideosPageProps {
  videos: VideoItem[];
}

export const VideosPage = ({ videos }: VideosPageProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = useMemo(() => {
    const sorted = [...videos].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    if (activeCategory === 'All') return sorted;
    return sorted.filter(v => getCategory(v) === activeCategory);
  }, [videos, activeCategory]);

  // Count per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: videos.length };
    for (const v of videos) {
      const cat = getCategory(v);
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [videos]);

  return (
    <>
      {/* Category filter bar */}
      <div className='flex flex-wrap gap-2 mb-6'>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            type='button'
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
              activeCategory === cat
                ? 'bg-accent text-accent-contrast border-accent'
                : 'bg-surface text-foreground-subtle border-border hover:border-accent-border hover:text-foreground',
            )}
          >
            {cat}
            {categoryCounts[cat] ? (
              <span
                className={cn(
                  'text-xs rounded-full px-1.5 py-0.5 font-semibold',
                  activeCategory === cat ? 'bg-accent-contrast/20' : 'bg-surface-subtle',
                )}
              >
                {categoryCounts[cat]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className='grid grid-cols-12 gap-4 lg:gap-6'
        >
          {filteredVideos.map((video, index) => {
            const { thumbnail, _id, featured, title, tags } = video;
            const thumbnailUrl = urlForImage(thumbnail);
            const common = { alt: title ?? '', fill: true, className: 'object-cover' };
            const desktopWidth = featured ? 1280 : 800;
            const desktopHeight = featured ? 720 : 900;
            const mobileWidth = featured ? 640 : 400;
            const mobileHeight = featured ? 420 : 450;

            const {
              props: { srcSet: desktop },
            } = getImageProps({
              ...common,
              quality: 80,
              src: thumbnailUrl?.width(desktopWidth).height(desktopHeight).url() || '',
            });
            const {
              props: { srcSet: mobile, ...rest },
            } = getImageProps({
              ...common,
              quality: 70,
              src: thumbnailUrl?.width(mobileWidth).height(mobileHeight).url() || '',
            });

            const displayTags = (tags ?? []).slice(0, 3);

            return (
              <motion.div
                key={_id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={cn(
                  featured
                    ? 'col-span-full lg:col-span-6'
                    : 'col-span-6 sm:col-span-6 lg:col-span-4',
                )}
              >
                <Link
                  href={`/videos/${video.slug}`}
                  className={cn(
                    'relative group flex flex-col overflow-hidden rounded-2xl',
                    'bg-surface border border-border cursor-pointer',
                    'transition-all duration-300 hover:border-accent-border hover:shadow-xl hover:-translate-y-1',
                    'block',
                  )}
                >
                  {/* Thumbnail */}
                  <div
                    className={cn(
                      'relative w-full overflow-hidden',
                      featured ? 'aspect-video' : 'aspect-video',
                    )}
                  >
                    {/* Play overlay */}
                    <div className='absolute inset-0 z-10 bg-black/20 group-hover:bg-black/40 transition-colors duration-300' />
                    <div className='absolute inset-0 z-20 flex items-center justify-center'>
                      <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 border border-white/30'>
                        <IconPlayerPlay
                          className='size-4 text-white ml-0.5'
                          stroke={2}
                          aria-hidden
                        />
                      </div>
                    </div>

                    {/* Featured badge */}
                    {featured && (
                      <div className='absolute top-3 left-3 z-20'>
                        <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-accent text-accent-contrast'>
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {displayTags.length > 0 && (
                      <div className='absolute top-3 right-3 z-20 flex gap-1.5'>
                        {displayTags.map(tag => (
                          <span
                            key={tag.name}
                            className='text-xs font-medium px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90'
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <picture className='absolute inset-0'>
                      <source media='(min-width: 1000px)' srcSet={desktop} />
                      <source media='(min-width: 500px)' srcSet={mobile} />
                      <img
                        {...rest}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={title ?? 'Video thumbnail'}
                        className='transition-transform duration-500 group-hover:scale-105'
                      />
                    </picture>
                  </div>

                  {/* Title */}
                  <div className='p-4 text-left flex-1 flex flex-col'>
                    <h3
                      className={cn(
                        'font-semibold text-foreground group-hover:text-accent transition-colors duration-200 line-clamp-1',
                        featured ? 'text-lg' : 'text-sm',
                      )}
                    >
                      {title}
                    </h3>
                    {video.linkedPainting && (
                      <div className='mt-auto pt-3 flex items-center gap-1.5'>
                        <span className='text-xs text-foreground-muted'>↗</span>
                        <span className='text-xs text-accent hover:underline'>
                          {video.linkedPainting.title}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
