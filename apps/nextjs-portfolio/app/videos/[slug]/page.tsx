import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BiLogoYoutube } from 'react-icons/bi';
import { BsEye, BsHeart } from 'react-icons/bs';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import Breadcrumbs from '@/app/components/layout/Breadcrumbs/Breadcrumbs';
import { formatCount, getYouTubeStats } from '@/lib/youtube';
import { sanityFetch } from '@/sanity/lib/live';
import { videoBySlugQuery, videosSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import VideoActions from './VideoActions';

type Props = { params: Promise<{ slug: string }> };

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] ?? null;
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.includes('/shorts/'))
        return u.pathname.split('/shorts/')[1]?.split('?')[0] ?? null;
      return u.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({
      query: videosSlugs,
      perspective: 'published',
      stega: false,
    });
    return ((data as { slug: string }[]) ?? []).map(v => ({ slug: v.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: videoBySlugQuery,
    params: await props.params,
    stega: false,
  });
  // biome-ignore lint/suspicious/noExplicitAny: query result
  const video = data as any;
  if (!video) return { title: 'Video | WiSiHe' };
  return {
    title: `${video.title} | WiSiHe`,
    description: video.description ?? `Watch ${video.title} by Henrik Sissener`,
    alternates: { canonical: `https://www.wisihe.no/videos/${video.slug}` },
    openGraph: {
      title: video.title,
      description: video.description ?? '',
      url: `https://www.wisihe.no/videos/${video.slug}`,
      type: 'video.other',
    },
  };
}

export default async function VideoPage(props: Props) {
  const params = await props.params;
  const { data } = await sanityFetch({ query: videoBySlugQuery, params });
  // biome-ignore lint/suspicious/noExplicitAny: query result
  const video = data as any;

  if (!video?._id) return notFound();

  const videoId = getYouTubeId(video.videoUrl ?? '');

  // Fetch real YouTube stats server-side (cached 1 hour, key never sent to browser)
  const youtubeStats = videoId ? await getYouTubeStats(videoId) : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description ?? '',
    thumbnailUrl: video.thumbnail
      ? urlForImage(video.thumbnail)?.width(640).height(360).url()
      : undefined,
    uploadDate: undefined,
    contentUrl: video.videoUrl,
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : undefined,
    author: { '@type': 'Person', name: 'Henrik Sissener', url: 'https://www.wisihe.no' },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.wisihe.no' },
      { '@type': 'ListItem', position: 2, name: 'Videos', item: 'https://www.wisihe.no/videos' },
      {
        '@type': 'ListItem',
        position: 3,
        name: video.title,
        item: `https://www.wisihe.no/videos/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />

      <div className='min-h-screen pt-32 pb-20 max-w-5xl mx-auto px-4'>
        <Breadcrumbs
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Videos', href: '/videos' },
            { label: video.title ?? 'Video' },
          ]}
        />

        {/* Video embed */}
        <div className='aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-border bg-black mb-8'>
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title={video.title}
              className='w-full h-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-foreground-muted'>
              <BiLogoYoutube className='w-16 h-16 opacity-30' />
            </div>
          )}
        </div>

        {/* Info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-4'>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>{video.title}</h1>

            {/* YouTube stats — server-fetched, cached 1 hour */}
            {youtubeStats && (
              <div className='flex items-center gap-5 text-sm text-foreground-muted'>
                <span className='flex items-center gap-1.5'>
                  <BsEye className='w-3.5 h-3.5' />
                  <span className='font-semibold text-foreground'>
                    {formatCount(youtubeStats.viewCount)}
                  </span>{' '}
                  views on YouTube
                </span>
                <span className='flex items-center gap-1.5'>
                  <BsHeart className='w-3.5 h-3.5' />
                  <span className='font-semibold text-foreground'>
                    {formatCount(youtubeStats.likeCount)}
                  </span>{' '}
                  YouTube likes
                </span>
              </div>
            )}

            {video.tags?.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {video.tags.map((tag: { name: string }) => (
                  <span
                    key={tag.name}
                    className='text-xs font-medium px-2.5 py-1 rounded-full bg-surface border border-border text-foreground-subtle'
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {video.description && (
              <p className='text-foreground-subtle leading-relaxed'>{video.description}</p>
            )}

            <VideoActions
              videoId={video._id}
              title={video.title ?? ''}
              viewsCount={video.viewsCount ?? 0}
              likesCount={video.likesCount ?? 0}
            />

            {video.videoUrl && (
              <a
                href={video.videoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors'
              >
                <BiLogoYoutube className='w-4 h-4' />
                Watch on YouTube
              </a>
            )}
          </div>

          {/* Linked painting */}
          {video.linkedPainting && (
            <div className='space-y-3'>
              <p className='text-xs font-semibold text-foreground-muted uppercase tracking-wider'>
                Related Painting
              </p>
              <Link href={`/paintings/${video.linkedPainting.slug}`} className='group block'>
                <div className='rounded-xl overflow-hidden border border-border transition-all duration-200 group-hover:border-accent-border group-hover:shadow-lg'>
                  {video.linkedPainting.image && (
                    <div className='relative aspect-[4/3] bg-surface-subtle'>
                      <Image
                        src={
                          urlForImage(video.linkedPainting.image)
                            ?.width(400)
                            .height(300)
                            .quality(75)
                            .url() ?? ''
                        }
                        alt={video.linkedPainting.title ?? ''}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                        placeholder={video.linkedPainting.image.lqip ? 'blur' : 'empty'}
                        blurDataURL={video.linkedPainting.image.lqip ?? undefined}
                      />
                    </div>
                  )}
                  <div className='p-3'>
                    <p className='text-sm font-medium text-foreground group-hover:text-accent transition-colors'>
                      {video.linkedPainting.title}
                    </p>
                    <p className='text-xs text-foreground-muted mt-0.5'>View painting →</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
