'use client';

import { IconArrowRight } from '@tabler/icons-react';
import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { Button } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import { urlForImage } from '@/sanity/lib/utils';
import HomeSectionHeader from '../HomeSectionHeader/HomeSectionHeader';

type VideoItem = NonNullable<HomeExtrasQueryResult>['videos'][number];

const DEFAULT_COPY = {
  eyebrow: '// Motion',
  title: 'Process & playback',
  description: 'Timelapses, animation tests, and game dev clips — a look behind the still frames.',
  linkLabel: 'All videos',
};

type VideosTeaserSectionProps = {
  intro: HomeSectionIntroCopy | null | undefined;
  videos: VideoItem[];
};

function VideoTeaserCard({ video, index }: { video: VideoItem; index: number }) {
  const thumbnailUrl = urlForImage(video.thumbnail);
  const src = thumbnailUrl?.width(800).height(450).url();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Link
        href={`/videos/${video.slug}`}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl',
          'border border-border bg-surface',
          'transition-all duration-300 hover:-translate-y-1 hover:border-accent-border hover:shadow-xl',
        )}
      >
        <div className='relative aspect-video w-full overflow-hidden'>
          {src ? (
            <Image
              src={src}
              alt={video.title ?? 'Video thumbnail'}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
              placeholder={video.thumbnail?.lqip ? 'blur' : 'empty'}
              blurDataURL={video.thumbnail?.lqip ?? undefined}
            />
          ) : (
            <div className='absolute inset-0 bg-surface-elevated' />
          )}
          <div className='absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110'>
              <FaPlay className='ml-0.5 size-4 text-white' aria-hidden />
            </div>
          </div>
          {video.featured ? (
            <span className='absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-contrast'>
              Featured
            </span>
          ) : null}
        </div>
        <div className='flex flex-col gap-1 p-4'>
          <h3 className='font-semibold text-foreground transition-colors group-hover:text-accent'>
            {video.title}
          </h3>
          {video.description ? (
            <p className='line-clamp-2 text-sm text-foreground-subtle'>{video.description}</p>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}

export default function VideosTeaserSection({ intro, videos }: VideosTeaserSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = mounted && prefersReducedMotion;

  if (videos.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);

  return (
    <section
      className='border-t border-border/20 bg-surface py-24 px-4 md:px-8'
      aria-labelledby='videos-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-12 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between'>
          <HomeSectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            headingId='videos-teaser-heading'
            align='left'
          />
          <Button
            as={Link}
            href='/videos'
            variant='secondary'
            size='medium'
            Icon={IconArrowRight}
            iconPosition='right'
            className='shrink-0 rounded-full'
          >
            {copy.linkLabel}
          </Button>
        </div>

        <div
          className={cn(
            'grid gap-6',
            videos.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {videos.map((video, index) => (
            <VideoTeaserCard key={video._id} video={video} index={reducedMotion ? 0 : index} />
          ))}
        </div>
      </div>
    </section>
  );
}
