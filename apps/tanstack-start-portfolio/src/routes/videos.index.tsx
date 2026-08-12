import { createFileRoute, Link } from '@tanstack/react-router';
import { Chip } from '@wisihe/ui-react';
import { FaPlay } from 'react-icons/fa';
import { PageHero } from '../components/layout/PageHero';
import { SanityImage } from '../components/sanity/SanityImage';
import { buildHead } from '../lib/seo';
import { getVideos } from '../server/fns';

export const Route = createFileRoute('/videos/')({
  loader: () => getVideos(),
  head: () =>
    buildHead({
      title: 'Videos | WiSiHe',
      description:
        'From timelapse drawings to game development and animations — digital creations in motion.',
      path: '/videos',
    }),
  component: VideosPage,
});

function VideosPage() {
  const { videos } = Route.useLoaderData();

  return (
    <div className='container mx-auto px-4 pt-32 pb-20'>
      <PageHero
        eyebrow='Motion'
        title='Videos'
        description='From timelapse drawings to game development and animations — a showcase of digital creations in motion.'
      />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {videos.map(video =>
          video.slug ? (
            <Link
              key={video._id}
              to='/videos/$slug'
              params={{ slug: video.slug }}
              className='group relative overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-xl'
            >
              <div className='relative aspect-video overflow-hidden'>
                {video.thumbnail ? (
                  <SanityImage
                    asset={video.thumbnail}
                    alt={video.title}
                    className='h-full w-full transition-transform duration-500 group-hover:scale-110'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center bg-surface-subtle text-foreground/30'>
                    No thumbnail
                  </div>
                )}
                <div className='absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40'>
                  <div className='flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg'>
                    <FaPlay className='ml-1' />
                  </div>
                </div>
              </div>
              <div className='p-5'>
                <h2 className='mb-2 text-xl font-bold transition-colors group-hover:text-accent'>
                  {video.title}
                </h2>
                {video.description ? (
                  <p className='mb-4 line-clamp-2 text-sm text-foreground/60'>
                    {video.description}
                  </p>
                ) : null}
                {video.tags?.length ? (
                  <div className='flex flex-wrap gap-2'>
                    {video.tags.map(tag =>
                      tag.name ? (
                        <Chip key={tag.name} label={tag.name} size='small' outlined />
                      ) : null,
                    )}
                  </div>
                ) : null}
              </div>
            </Link>
          ) : null,
        )}
      </div>
    </div>
  );
}
