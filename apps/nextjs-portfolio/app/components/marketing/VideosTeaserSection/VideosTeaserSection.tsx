'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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

const sectionEase = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: sectionEase, delay: index * 0.08 },
  }),
};

type VideosTeaserSectionProps = {
  intro: HomeSectionIntroCopy | null | undefined;
  videos: VideoItem[];
};

function VideosDesktopShowcase({
  videos,
  reducedMotion,
}: {
  videos: VideoItem[];
  reducedMotion: boolean;
}) {
  const [heroVideo, ...secondaryVideos] = videos;
  if (!heroVideo) return null;

  return (
    <div className='hidden lg:block'>
      <motion.div
        custom={0}
        variants={reducedMotion ? undefined : cardVariants}
        initial={reducedMotion ? false : 'hidden'}
        whileInView={reducedMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-40px' }}
      >
        <VideoTeaserCard video={heroVideo} index={0} layout='cinema' />
      </motion.div>

      {secondaryVideos.length > 0 ? (
        <ul
          className={cn(
            'mt-4 grid gap-4',
            secondaryVideos.length === 1 ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          {secondaryVideos.map((video, i) => (
            <motion.li
              key={video._id}
              custom={i + 1}
              variants={reducedMotion ? undefined : cardVariants}
              initial={reducedMotion ? false : 'hidden'}
              whileInView={reducedMotion ? undefined : 'visible'}
              viewport={{ once: true, margin: '-40px' }}
            >
              <VideoTeaserCard video={video} index={i + 1} layout='row' className='h-full' />
            </motion.li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function VideosTeaserSection({ intro, videos }: VideosTeaserSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(mounted && prefersReducedMotion);

  if (videos.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);

  return (
    <section
      className='border-t border-border/20 bg-background py-24 px-4 md:px-8'
      aria-labelledby='videos-teaser-heading'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between'>
          <HomeSectionHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            headingId='videos-teaser-heading'
            align='left'
          />
          <Link
            href='/videos'
            className='group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-border/60 bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-foreground transition-[border-color,background-color,color,transform] duration-300 hover:border-accent/45 hover:bg-accent hover:text-accent-contrast md:self-auto'
          >
            {copy.linkLabel}
            <IconArrowRight
              aria-hidden
              className='size-4 transition-transform duration-300 group-hover:translate-x-0.5'
            />
          </Link>
        </div>

        <VideosMobileCarousel videos={videos} />
        <VideosDesktopShowcase videos={videos} reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
