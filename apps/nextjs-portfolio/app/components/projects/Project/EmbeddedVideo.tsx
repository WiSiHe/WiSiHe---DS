interface EmbeddedVideoProps {
  videoUrl: string;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const videoUrl = new URL(url);

    if (videoUrl.hostname === 'youtu.be') {
      return videoUrl.pathname.slice(1);
    }

    if (videoUrl.hostname.includes('youtube.com')) {
      if (videoUrl.pathname.includes('/shorts/')) {
        return videoUrl.pathname.split('/shorts/')[1] ?? null;
      }
      const videoId = videoUrl.searchParams.get('v');
      if (videoId) return videoId;
    }

    return null;
  } catch (error) {
    console.error('Invalid YouTube URL:', url, error);
    return null;
  }
}

export default function EmbeddedVideo({ videoUrl }: EmbeddedVideoProps) {
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className='flex aspect-video items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle'>
        <p className='text-sm text-foreground-subtle'>Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm'>
      <div className='aspect-video'>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className='h-full w-full'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Project video'
          loading='lazy'
        />
      </div>
    </div>
  );
}
