'use client';

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Chip } from '@wisihe/ui-react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { urlForImage } from '@/sanity/lib/utils';

function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match?.[2];
  return id && id.length >= 11 ? id : '';
}

type VideoItem = {
  _id: string;
  slug: string | null;
  title: string | null;
  featured?: boolean | null;
  description?: string | null;
  videoUrl?: string | null;
  tags?: { name: string | null }[] | null;
  thumbnail?: { asset?: { _ref: string }; lqip?: string } | null;
  linkedPainting?: {
    _id: string;
    slug: string | null;
    title: string | null;
    image?: { asset?: { _ref: string }; lqip?: string } | null;
  } | null;
};

interface VideosPageProps {
  videos: VideoItem[];
}

export const VideosPage = ({ videos }: VideosPageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedVideo(null);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose],
  );

  // Set up the event listener when the component mounts
  // and clean it up when the component unmounts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className='grid grid-cols-12 gap-6'>
        {videos
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          .map((video: VideoItem) => {
            const { thumbnail, _id, featured, title, description, tags } = video;

            const thumbnailUrl = urlForImage(thumbnail);
            const common = {
              alt: video.title ?? '',
              fill: true,
              className: 'object-cover',
            };

            // desktop
            const desktopWidth = featured ? 1280 : 800;
            const desktopHeight = featured ? 720 : 1100;
            // mobile
            const mobileWidth = featured ? 640 : 400;
            const mobileHeight = featured ? 420 : 400;

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

            return (
              <button
                type='button'
                key={_id}
                onClick={() => handleVideoClick(video)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleVideoClick(video);
                  }
                }}
                tabIndex={0}
                className={cn(
                  'relative bg-surface border border-border/30 flex flex-col transition-all duration-300 w-full h-full shadow-lg hover:shadow-xl rounded-lg overflow-clip cursor-pointer group hover:border-accent/30',
                  featured ? 'col-span-full lg:col-span-6' : 'col-span-6 lg:col-span-3',
                )}
              >
                <motion.div
                  className={cn(
                    ' w-full h-full',
                    featured ? 'aspect-video flex relative' : 'aspect-square lg:aspect-portrait',
                  )}
                  layoutId={`video-${_id}`}
                >
                  <div className='absolute inset-0 transition-all duration-300 opacity-20 bg-accent group-hover:opacity-60'></div>
                  <div className='absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110'>
                    <FaPlay className='text-5xl text-white drop-shadow-2xl' />
                  </div>
                  <picture className='w-full'>
                    <source media='(min-width: 1000px)' srcSet={desktop} />
                    <source media='(min-width: 500px)' srcSet={mobile} />
                    <img
                      {...rest}
                      style={{ width: '100%', height: '100%' }}
                      className={cn(
                        'object-cover w-full h-full',
                        featured ? 'aspect-video' : 'aspect-square lg:aspect-portrait',
                      )}
                      alt={video.title || 'Video thumbnail'}
                    />
                  </picture>
                </motion.div>
                {featured && (
                  <div className='relative p-4 text-left shrink-0 text-foreground bg-surface'>
                    <h3 className='text-xl font-bold text-foreground mb-2'>{title}</h3>
                    {tags && (
                      <div className='flex flex-wrap gap-2 py-2'>
                        {tags.map(tag => (
                          <Chip
                            key={tag.name ?? ''}
                            label={tag.name ?? ''}
                            outlined
                            interactive={false}
                          />
                        ))}
                      </div>
                    )}
                    <p className='line-clamp-3 text-foreground-subtle'>{description}</p>
                  </div>
                )}
              </button>
            );
          })}
      </div>
      <AnimatePresence>
        {isOpen && selectedVideo && (
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='relative z-50'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/60 backdrop-blur-lg'
            />

            <div className='fixed inset-0 flex items-center justify-center w-screen p-4 overflow-y-auto sm:p-6 md:p-10 lg:p-12'>
              <DialogPanel
                layoutId={`video-${selectedVideo?._id}`}
                as={motion.div}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.3 },
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.3 },
                }}
                className='w-full relative max-w-6xl max-h-[90vh] bg-surface-elevated border border-border rounded-lg shadow-2xl overflow-hidden'
              >
                <div className='absolute z-20 flex items-center justify-center left-4 right-4 -top-16'>
                  <button
                    type='button'
                    onClick={() => setIsOpen(false)}
                    className='flex gap-2 px-4 py-2 rounded-lg text-accent-contrast transition-all duration-200 cursor-pointer bg-accent hover:bg-accent-hover shadow-lg'
                    aria-label='Close video'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      aria-hidden='true'
                      focusable='false'
                    >
                      <line x1='18' y1='6' x2='6' y2='18'></line>
                      <line x1='6' y1='6' x2='18' y2='18'></line>
                    </svg>
                    <span className=''>Close video</span>
                  </button>
                </div>
                {selectedVideo?.videoUrl && (
                  <div className='w-full bg-accent aspect-square lg:aspect-video'>
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo?.videoUrl)}?autoplay=1&loop=1&playlist=${getYouTubeVideoId(selectedVideo?.videoUrl)}`}
                      className='w-full h-full'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={selectedVideo.title ?? ''}
                    />
                  </div>
                )}

                <div className='p-6 overflow-y-auto text-foreground'>
                  <DialogTitle className='pb-4 text-2xl font-bold text-foreground'>
                    {selectedVideo?.title}
                  </DialogTitle>
                  <Description className='line-clamp-3 text-foreground-subtle'>
                    {selectedVideo?.description}
                  </Description>
                  {selectedVideo?.linkedPainting && (
                    <div className='mt-4'>
                      <h3 className='mb-2 text-lg font-bold text-foreground'>
                        The finished painting:
                      </h3>
                      <Link href={`/paintings/${selectedVideo?.linkedPainting?.slug}`}>
                        <Image
                          src={
                            urlForImage(selectedVideo?.linkedPainting?.image)
                              ?.width(100)
                              .height(100)
                              .url() || ''
                          }
                          alt={selectedVideo?.linkedPainting?.title || 'Painting'}
                          width={100}
                          height={100}
                          className='rounded-lg'
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
