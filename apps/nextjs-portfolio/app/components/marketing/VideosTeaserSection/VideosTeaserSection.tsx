'use client';

import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import HomeSectionHeader from '../HomeSectionHeader/HomeSectionHeader';
import VideosMobileCarousel from './VideosMobileCarousel';
import { VideoTeaserCard } from './VideoTeaserCard';
import type { VideoItem } from './videoTeaserShared';

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

function splitFeaturedVideos(videos: VideoItem[]) {
  const featured = videos.find(video => video.featured) ?? videos[0];
  if (!featured) return { featured: null, rest: [] as VideoItem[] };
  const rest = videos.filter(video => video._id !== featured._id);
  return { featured, rest };
}

export default function VideosTeaserSection({ intro, videos }: VideosTeaserSectionProps) {
  const { featured, rest } = useMemo(() => splitFeaturedVideos(videos), [videos]);

  if (videos.length === 0 || !featured) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);
  const featuredIndex = videos.findIndex(video => video._id === featured._id);

  return (
    <section
      className='border-t border-border/10 bg-background py-16 px-4 md:px-8 md:py-20'
      aria-labelledby='videos-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between'>
          <div className='flex flex-col gap-4 md:flex-row md:items-end md:gap-8'>
            <HomeSectionHeader
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={copy.description}
              headingId='videos-teaser-heading'
              align='left'
            />
            <p className='flex items-center gap-2 self-start rounded-full border border-border/60 bg-surface/80 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle backdrop-blur-sm md:self-auto'>
              <IconPlayerPlay className='size-3 text-accent' aria-hidden />
              {videos.length} {videos.length === 1 ? 'clip' : 'clips'}
            </p>
          </div>
          <Button
            as={Link}
            href='/videos'
            variant='secondary'
            size='medium'
            Icon={IconArrowRight}
            iconPosition='right'
            className='shrink-0 self-start rounded-full md:self-auto'
          >
            {copy.linkLabel}
          </Button>
        </div>

        <div className='md:hidden'>
          <VideosMobileCarousel videos={videos} />
        </div>

        <div className='hidden space-y-10 md:block'>
          <VideoTeaserCard
            video={featured}
            index={featuredIndex}
            variant='featured'
            imageClassName='object-cover'
          />

          {rest.length > 0 ? (
            <ul
              className={
                rest.length === 1
                  ? 'grid max-w-xl gap-6'
                  : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              }
            >
              {rest.map(video => {
                const videoIndex = videos.findIndex(item => item._id === video._id);
                return (
                  <li key={video._id}>
                    <VideoTeaserCard video={video} index={videoIndex} />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
