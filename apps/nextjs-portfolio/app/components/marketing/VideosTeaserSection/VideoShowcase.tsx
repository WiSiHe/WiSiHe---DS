'use client';

import { useMemo, useState } from 'react';
import VideoPlaybackScreen from './VideoPlaybackScreen';
import VideoPlaylist, { FilmStripDivider } from './VideoPlaylist';
import { splitFeaturedVideos, type VideoItem } from './videoTeaserShared';

type VideoShowcaseProps = {
  videos: VideoItem[];
};

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const { featured } = useMemo(() => splitFeaturedVideos(videos), [videos]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(featured);

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
          <VideoPlaybackScreen
            key={current._id}
            video={current}
            index={activeIndex >= 0 ? activeIndex : 0}
            priority={activeIndex === 0}
          />

          {queueVideos.length > 0 ? (
            <>
              <FilmStripDivider />
              <VideoPlaylist
                videos={videos}
                activeId={current._id}
                onSelect={setActiveVideo}
                className='lg:hidden'
              />
            </>
          ) : null}
        </div>

        {queueVideos.length > 0 ? (
          <VideoPlaylist
            videos={videos}
            activeId={current._id}
            onSelect={setActiveVideo}
            className='hidden lg:block'
          />
        ) : null}
      </div>
    </div>
  );
}
