'use client';

import { IconArrowRight } from '@tabler/icons-react';
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
  description: 'Timelapses, trailers, and process reels from painting and game work.',
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

export default function VideosTeaserSection({ intro, videos }: VideosTeaserSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(mounted && prefersReducedMotion);

  if (videos.length === 0) return null;

  const copy = pickSectionIntro(intro, DEFAULT_COPY);
  const [heroVideo, ...secondaryVideos] = videos;
  if (!heroVideo) return null;

  return (
    <section
      className='border-t border-border/20 bg-background py-24 px-4 md:px-8'
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
          <Link
            href='/videos'
            className='group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border/60 bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-foreground transition-[border-color,background-color,color,transform] duration-300 hover:border-accent/45 hover:bg-accent hover:text-accent-contrast'
          >
            {copy.linkLabel}
            <IconArrowRight
              aria-hidden
              className='size-4 transition-transform duration-300 group-hover:translate-x-0.5'
            />
          </Link>
        </div>

        <VideosMobileCarousel videos={videos} />

        {videos.length === 1 ? (
          <div className='hidden lg:block'>
            <motion.div
              custom={0}
              variants={reducedMotion ? undefined : cardVariants}
              initial={reducedMotion ? false : 'hidden'}
              whileInView={reducedMotion ? undefined : 'visible'}
              viewport={{ once: true, margin: '-40px' }}
            >
              <VideoTeaserCard video={heroVideo} index={0} featuredLayout />
            </motion.div>
          </div>
        ) : (
          <ul className='hidden gap-6 lg:grid lg:grid-cols-12'>
            <motion.li
              className='lg:col-span-8'
              custom={0}
              variants={reducedMotion ? undefined : cardVariants}
              initial={reducedMotion ? false : 'hidden'}
              whileInView={reducedMotion ? undefined : 'visible'}
              viewport={{ once: true, margin: '-40px' }}
            >
              <VideoTeaserCard video={heroVideo} index={0} featuredLayout />
            </motion.li>
            {secondaryVideos.map((video, i) => (
              <motion.li
                key={video._id}
                className='lg:col-span-4'
                custom={i + 1}
                variants={reducedMotion ? undefined : cardVariants}
                initial={reducedMotion ? false : 'hidden'}
                whileInView={reducedMotion ? undefined : 'visible'}
                viewport={{ once: true, margin: '-40px' }}
              >
                <VideoTeaserCard video={video} index={i + 1} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
