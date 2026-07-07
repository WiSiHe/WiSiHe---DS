import type { VideoBySlugQueryResult } from '@wisihe/sanity-queries';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/components/cms/JsonLd/JsonLd';
import { buildBreadcrumbJsonLd, buildPersonReference } from '@/lib/seo/jsonLd';
import { buildContentMetadata, resolveSeoCopy } from '@/lib/seo/metadata';
import { getYouTubeStats } from '@/lib/youtube';
import { sanityFetch } from '@/sanity/lib/live';
import { videoBySlugQuery, videosSlugs } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/utils';
import { VideoDetail } from './VideoDetail';

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
  const params = await props.params;
  const { data } = await sanityFetch({
    query: videoBySlugQuery,
    params,
    stega: false,
  });
  const video = data as VideoBySlugQueryResult;

  if (!video?.title) {
    return { title: 'Video not found' };
  }

  const { title, description, noIndex } = resolveSeoCopy(video.seo, {
    title: video.title,
    description: video.description ?? `Watch ${video.title} by Henrik Sissener`,
  });

  return buildContentMetadata({
    title,
    description,
    path: `/videos/${video.slug}`,
    seoImage: video.seo?.image,
    fallbackImage: video.thumbnail,
    imageAlt: video.thumbnail?.alt ?? video.title,
    noIndex,
    openGraphType: 'video.other',
    keywords: video.tags?.map(tag => tag.name).filter(Boolean) as string[] | undefined,
  });
}

export default async function VideoPage(props: Props) {
  const params = await props.params;
  const { data } = await sanityFetch({ query: videoBySlugQuery, params });
  const video = data as VideoBySlugQueryResult;

  if (!video?._id || !video.slug) return notFound();

  const youtubeVideoId = getYouTubeId(video.videoUrl ?? '');
  const youtubeStats = youtubeVideoId ? await getYouTubeStats(youtubeVideoId) : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.seo?.title?.trim() || video.title,
    description: video.seo?.description?.trim() || video.description || '',
    thumbnailUrl: video.thumbnail
      ? urlForImage(video.thumbnail)?.width(640).height(360).url()
      : undefined,
    contentUrl: video.videoUrl,
    embedUrl: youtubeVideoId ? `https://www.youtube.com/embed/${youtubeVideoId}` : undefined,
    author: buildPersonReference(),
  };

  const breadcrumbData = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Videos', path: '/videos' },
    { name: video.title ?? 'Video', path: `/videos/${params.slug}` },
  ]);

  const linkedPaintingImage = video.linkedPainting?.image
    ? urlForImage(video.linkedPainting.image)?.width(400).height(300).quality(75)
    : null;

  const linkedPainting = video.linkedPainting?.slug
    ? {
        slug: video.linkedPainting.slug,
        title: video.linkedPainting.title ?? 'Painting',
        imageUrl: linkedPaintingImage?.url() ?? null,
        blurDataURL: video.linkedPainting.image?.lqip ?? null,
      }
    : null;

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />

      <VideoDetail
        slug={video.slug}
        videoId={video._id}
        title={video.title ?? 'Video'}
        description={video.description ?? null}
        tags={(video.tags ?? [])
          .map(tag => tag.name?.trim())
          .filter((name): name is string => Boolean(name))}
        viewsCount={video.viewsCount ?? 0}
        likesCount={video.likesCount ?? 0}
        videoUrl={video.videoUrl ?? null}
        youtubeVideoId={youtubeVideoId}
        youtubeStats={youtubeStats}
        linkedPainting={linkedPainting}
      />
    </>
  );
}
