'use client';

import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import {
  staggerContainerVariants,
  staggerSlideRightItemVariants,
  useSectionReveal,
} from '@/lib/motion/sectionReveal';
import VideoPlaybackScreen from './VideoPlaybackScreen';
import VideoPlaylist, { FilmStripDivider } from './VideoPlaylist';
import { splitFeaturedVideos, type VideoItem } from './videoTeaserShared';

type VideoShowcaseProps = {
  videos: VideoItem[];
};

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const { featured } = useMemo(() => splitFeaturedVideos(videos), [videos]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(featured);
  const { reducedMotion, viewport, transition, playerEmergenceInitial, playerEmergenceAnimate } =
    useSectionReveal();
  const playlistVariants = staggerSlideRightItemVariants(reducedMotion);
  const playlistContainerVariants = staggerContainerVariants(reducedMotion, 0.06);

  const current = activeVideo ?? featured;
  if (!current) return null;

  const activeIndex = videos.findIndex(video => video._id === current._id);
  const queueVideos = videos.filter(video => video._id !== current._id);

  return (
    <div className='relative'>
      <div
        className='pointer-events-none absolute -left-8 top-1/4 h-48 w-48 rounded-full bg-accent/8 blur-3xl md:h-64 md:w-64'
        aria-hidden
      />

      <div className='relative z-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10 xl:gap-12'>
        <div>
          <motion.div
            initial={playerEmergenceInitial}
            whileInView={playerEmergenceAnimate}
            viewport={viewport}
            transition={{ ...transition, duration: 0.6 }}
          >
            <VideoPlaybackScreen
              key={current._id}
              video={current}
              index={activeIndex >= 0 ? activeIndex : 0}
              priority={activeIndex === 0}
            />
          </motion.div>

          {queueVideos.length > 0 ? (
            <>
              <FilmStripDivider />
              <motion.div
                className='lg:hidden'
                initial='hidden'
                whileInView='visible'
                viewport={viewport}
                variants={playlistContainerVariants}
              >
                <VideoPlaylist
                  videos={videos}
                  activeId={current._id}
                  onSelect={setActiveVideo}
                  itemVariants={playlistVariants}
                />
              </motion.div>
            </>
          ) : null}
        </div>

        {queueVideos.length > 0 ? (
          <motion.div
            className='hidden lg:block'
            initial='hidden'
            whileInView='visible'
            viewport={viewport}
            variants={playlistContainerVariants}
          >
            <VideoPlaylist
              videos={videos}
              activeId={current._id}
              onSelect={setActiveVideo}
              itemVariants={playlistVariants}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
