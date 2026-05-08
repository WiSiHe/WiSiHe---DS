import { createFileRoute } from '@tanstack/react-router';
import { getAllVideos } from '@wisihe/sanity-queries';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { SanityImage } from '../components/sanity/SanityImage';
import { pageVariants, springJuicy } from '../lib/motion';
import { client } from '../lib/sanity';

export const Route = createFileRoute('/videos')({
  loader: async () => {
    const data = await client.fetch(getAllVideos);
    return data;
  },
  component: VideosPage,
});

function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match?.[2];
  return id && id.length >= 11 ? id : '';
}

function VideosPage() {
  const { videos } = Route.useLoaderData();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const handleClose = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='container mx-auto px-4 pt-32 pb-20'
    >
      <div className='max-w-4xl mb-12'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-4xl md:text-5xl font-bold mb-4'
        >
          Videos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='text-lg md:text-xl text-foreground/70 text-pretty leading-relaxed'
        >
          From timelapse drawings to game development and animations — a showcase of my digital
          creations in motion.
        </motion.p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {videos.map((video: any, index: number) => (
          <motion.button
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            onClick={() => setSelectedVideo(video)}
            className='group relative bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/50 transition-all text-left'
          >
            <div className='aspect-video relative overflow-hidden'>
              <SanityImage
                src={video.thumbnail}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className='w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-contrast shadow-lg'
                >
                  <FaPlay className='ml-1 text-xl' />
                </motion.div>
              </div>
            </div>

            <div className='p-5'>
              <h3 className='text-xl font-bold mb-2 group-hover:text-accent transition-colors'>
                {video.title}
              </h3>
              <p className='text-sm text-foreground/60 line-clamp-2 mb-4'>{video.description}</p>
              {video.tags && (
                <div className='flex flex-wrap gap-2'>
                  {video.tags.map((tag: any) => (
                    <Chip key={tag.name} label={tag.name} size='sm' outlined />
                  ))}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className='absolute inset-0 bg-background/80 backdrop-blur-xl'
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={springJuicy}
              className='relative w-full max-w-5xl bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col'
            >
              <button
                onClick={handleClose}
                className='absolute top-4 right-4 z-10 w-10 h-10 bg-surface/50 backdrop-blur-md rounded-full flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-contrast transition-all'
              >
                <FaTimes />
              </button>

              <div className='aspect-video bg-black'>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo.videoUrl)}?autoplay=1`}
                  className='w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title={selectedVideo.title}
                />
              </div>

              <div className='p-8'>
                <h2 className='text-2xl md:text-3xl font-bold mb-3'>{selectedVideo.title}</h2>
                <p className='text-foreground/70 leading-relaxed max-w-3xl'>
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
