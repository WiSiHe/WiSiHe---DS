'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';
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

  return (
    <section
      className='relative overflow-hidden border-t border-border/10 bg-background py-16 px-4 md:px-8 md:py-20'
      aria-labelledby='videos-teaser-heading'
    >
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,#000_20%,transparent_100%)]'
        aria-hidden
      />

      <div className='relative z-10 mx-auto max-w-7xl'>
        <div className='mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between'>
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
            className='shrink-0 self-start rounded-full md:self-auto'
          >
            {copy.linkLabel}
          </Button>
        </div>

        <VideosMobileCarousel videos={videos} />

        <ul className='hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {videos.map((video, index) => (
            <motion.li
              key={video._id}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: sectionEase, delay: index * 0.08 }
              }
            >
              <VideoTeaserCard video={video} index={index} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
