import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundMessage } from '../../components/layout/PageHero';
import { VideoDetailView } from '../../components/videos/VideoDetailView';
import { buildHead } from '../../lib/seo';
import { buildBreadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { buildVideoStructuredData } from '../../lib/seo/structuredData';
import { getVideo, getVideos, imageUrl } from '../../server/fns';

function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] ?? null;
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.includes('/shorts/')) {
        return u.pathname.split('/shorts/')[1]?.split('?')[0] ?? null;
      }
      return u.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute('/videos/$slug')({
  loader: async ({ params }) => {
    const [video, allVideos] = await Promise.all([
      getVideo({ data: { slug: params.slug } }),
      getVideos(),
    ]);

    if (!video?._id || !video.slug) throw notFound();

    const videoList = Array.isArray(allVideos)
      ? allVideos
      : ((allVideos as { videos?: Array<{ slug?: string | null }> } | null)?.videos ?? []);
    const slugs = videoList
      .map((v: { slug?: string | null }) => v.slug)
      .filter((slug): slug is string => Boolean(slug));
    const index = slugs.indexOf(params.slug);

    return {
      video,
      prevSlug: index > 0 ? slugs[index - 1] : null,
      nextSlug: index >= 0 && index < slugs.length - 1 ? slugs[index + 1] : null,
    };
  },
  head: ({ loaderData }) => {
    const video = loaderData?.video;
    const structuredData = video
      ? buildVideoStructuredData({
          slug: video.slug,
          title: video.seo?.title || video.title || 'Video',
          description: video.seo?.description || video.description,
          thumbnailUrl: imageUrl(video.thumbnail, 640, 360),
          videoUrl: video.videoUrl,
          youtubeVideoId: getYouTubeId(video.videoUrl),
          uploadDate: (video as typeof video & { uploadDate?: string | null }).uploadDate,
        })
      : null;
    const breadcrumbData = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Videos', path: '/videos' },
      { name: video?.title || 'Video', path: `/videos/${video?.slug}` },
    ]);

    return buildHead({
      title: video?.seo?.title || video?.title || 'Video',
      description:
        video?.seo?.description || video?.description || `Watch ${video?.title} by Henrik Sissener`,
      path: `/videos/${video?.slug}`,
      imageUrl: imageUrl(video?.seo?.image ?? video?.thumbnail, 1200, 630),
      noIndex: video?.seo?.noIndex,
      type: 'video.other',
      jsonLd: structuredData ? [structuredData, breadcrumbData] : undefined,
    });
  },
  notFoundComponent: () => (
    <NotFoundMessage title='Video not found' description='This video does not exist.' />
  ),
  component: VideoDetailPage,
});

function VideoDetailPage() {
  const { video, prevSlug, nextSlug } = Route.useLoaderData();
  return <VideoDetailView video={video} prevSlug={prevSlug} nextSlug={nextSlug} />;
}
