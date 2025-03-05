'use client';

import { GetAllVideosResult } from '@/sanity.types';
import { urlForImage } from '@/sanity/lib/utils';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { cn } from '@wisihe/utils';
import { AnimatePresence, motion } from 'motion/react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import Chip from '../Chip/Chip';

function getYouTubeVideoId(url: string): string {
  try {
    const videoUrl = new URL(url);
    // Handle youtu.be format
    if (videoUrl.hostname === 'youtu.be') {
      return videoUrl.pathname.slice(1);
    }
    // Handle youtube.com formats including shorts
    if (videoUrl.hostname.includes('youtube.com')) {
      if (videoUrl.pathname.includes('/shorts/')) {
        return videoUrl.pathname.split('/shorts/')[1];
      }
      const videoId = videoUrl.searchParams.get('v');
      if (videoId) return videoId;
    }
    // Fallback to original behavior
    return videoUrl.pathname.slice(1);
  } catch (error) {
    return error as string;
  }
}

interface VideosPageProps {
  videos: GetAllVideosResult['videos'];
}

export const VideosPage = ({ videos }: VideosPageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<
    GetAllVideosResult['videos'][0] | null
  >(null);

  const handleVideoClick = (video: GetAllVideosResult['videos'][0]) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedVideo(null);
  };

  // Add event listener for escape key to close video modal
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  // Set up the event listener when the component mounts
  // and clean it up when the component unmounts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {videos
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
          .map((video: GetAllVideosResult['videos'][0]) => {
            const { thumbnail, _id, featured, title, description, tags } =
              video;

            const thumbnailUrl = urlForImage(thumbnail);
            const common = {
              alt: video.title,
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
              src:
                thumbnailUrl?.width(desktopWidth).height(desktopHeight).url() ||
                '',
            });
            const {
              props: { srcSet: mobile, ...rest },
            } = getImageProps({
              ...common,
              quality: 70,
              src:
                thumbnailUrl?.width(mobileWidth).height(mobileHeight).url() ||
                '',
            });

            return (
              <button
                key={_id}
                onClick={() => handleVideoClick(video)}
                className={cn(
                  'relative bg-tertiary flex roun flex-col transition-all duration-300 w-full h-full rounded-lg overflow-clip cursor-pointer group',
                  featured
                    ? 'col-span-full lg:col-span-6'
                    : 'col-span-6 lg:col-span-3'
                )}
              >
                <motion.div
                  className={cn(
                    '',
                    featured
                      ? 'aspect-video flex relative'
                      : 'aspect-square lg:aspect-portrait'
                  )}
                  layoutId={`video-${_id}`}
                >
                  <div className="absolute inset-0 transition-all duration-300 opacity-20 bg-primary group-hover:opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-120">
                    <FaPlay className="text-5xl text-white" />
                  </div>
                  <picture className="">
                    <source media="(min-width: 1000px)" srcSet={desktop} />
                    <source media="(min-width: 500px)" srcSet={mobile} />
                    <img
                      {...rest}
                      style={{ width: '100%', height: '100%' }}
                      className={cn(
                        'object-cover w-full h-full',
                        featured
                          ? 'aspect-video'
                          : 'aspect-square lg:aspect-portrait'
                      )}
                    />
                  </picture>
                </motion.div>
                {featured && (
                  <div className="relative p-4 text-left shrink-0 text-dark">
                    <h3 className="text-xl font-bold">{title}</h3>
                    {tags && (
                      <div className="flex flex-wrap gap-2 py-2">
                        {tags.map((tag) => (
                          <Chip key={tag.name} label={tag.name} outlined />
                        ))}
                      </div>
                    )}
                    <p className="line-clamp-3">{description}</p>
                  </div>
                )}
              </button>
            );
          })}
      </div>
      <AnimatePresence>
        {isOpen && selectedVideo && (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70"
            />

            <div className="fixed inset-0 flex items-center justify-center w-screen p-4 overflow-y-auto sm:p-6 md:p-10 lg:p-12">
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
                className="w-full relative max-w-6xl  max-h-[90vh] bg-dark rounded-lg"
              >
                <div className="absolute z-20 flex items-center justify-center left-4 right-4 -top-16">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex gap-2 p-4 text-white transition-colors cursor-pointer bg-primary"
                    aria-label="Close video"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="">Close video</span>
                  </button>
                </div>
                {selectedVideo?.videoUrl && (
                  <div className="w-full bg-primary aspect-square lg:aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo?.videoUrl)}?autoplay=1&loop=1&playlist=${getYouTubeVideoId(selectedVideo?.videoUrl)}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  </div>
                )}

                <div className="p-4 overflow-y-auto text-white">
                  <DialogTitle className="pb-4 text-2xl font-bold">
                    {selectedVideo?.title}
                  </DialogTitle>
                  <Description className="line-clamp-3">
                    {selectedVideo?.description}
                  </Description>
                  {selectedVideo?.linkedPainting && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-lg font-bold">
                        The finished painting:
                      </h3>
                      <Link
                        href={`/paintings/${selectedVideo?.linkedPainting?.slug}`}
                      >
                        <Image
                          src={
                            urlForImage(selectedVideo?.linkedPainting?.image)
                              ?.width(100)
                              .height(100)
                              .url() || ''
                          }
                          alt={
                            selectedVideo?.linkedPainting?.title || 'Painting'
                          }
                          width={100}
                          height={100}
                          className="rounded-lg"
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
