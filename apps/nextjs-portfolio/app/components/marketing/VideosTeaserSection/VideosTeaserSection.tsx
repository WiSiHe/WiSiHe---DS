'use client';

import { IconArrowRight, IconPlayerPlay } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
import Link from 'next/link';
import { type HomeSectionIntroCopy, pickSectionIntro } from '@/lib/homeSectionCopy';
import VideoShowcase from './VideoShowcase';
import { formatClipCount, type VideoItem } from './videoTeaserShared';

const DEFAULT_COPY = {
  eyebrow: '// Motion',
  title: 'Press play',
  description: 'Timelapses, animation tests, and game dev clips — the moving side of the studio.',
  linkLabel: 'All videos',
};

type VideosTeaserSectionProps = {
  intro: HomeSectionIntroCopy | null | undefined;
  videos: VideoItem[];
};

export default function VideosTeaserSection({ intro, videos }: VideosTeaserSectionProps) {
  if (videos.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);

  return (
    <section
      className='relative isolate overflow-hidden border-t border-border/20 bg-background px-4 py-16 md:px-8 md:py-24'
      aria-labelledby='videos-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <header className='relative z-10 mb-10 md:mb-14 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10'>
          <div className='lg:col-span-7'>
            <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-accent md:text-xs'>
              {copy.eyebrow}
            </p>
            <h2
              id='videos-teaser-heading'
              className='max-w-xl font-serif text-[clamp(2rem,8vw,3.75rem)] font-extrabold leading-[0.95] tracking-tight text-foreground'
            >
              {copy.title}
            </h2>
            {copy.description ? (
              <p className='mt-4 max-w-lg text-base leading-relaxed text-foreground-subtle text-pretty md:text-lg'>
                {copy.description}
              </p>
            ) : null}
          </div>

          <div className='mt-5 flex flex-wrap items-center gap-3 lg:col-span-5 lg:mt-0 lg:justify-end'>
            <p className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/80 px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle backdrop-blur-sm'>
              <IconPlayerPlay className='size-3 text-accent' aria-hidden />
              {formatClipCount(videos.length)}
            </p>
            <Button
              as={Link}
              href='/videos'
              variant='secondary'
              size='medium'
              Icon={IconArrowRight}
              iconPosition='right'
              className='hidden shrink-0 rounded-full sm:inline-flex'
            >
              {copy.linkLabel}
            </Button>
          </div>
        </header>

        <VideoShowcase videos={videos} />

        <div className='relative z-10 mt-10 border-t border-border/15 pt-8 sm:hidden'>
          <Button
            as={Link}
            href='/videos'
            variant='primary'
            size='large'
            Icon={IconArrowRight}
            iconPosition='right'
            className='w-full rounded-full'
          >
            {copy.linkLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
