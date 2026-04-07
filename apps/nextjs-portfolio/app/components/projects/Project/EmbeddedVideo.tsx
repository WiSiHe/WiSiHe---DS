interface EmbeddedVideoProps {
  videoUrl: string;
}

// Utility function for extracting YouTube video ID with better error handling
function getYouTubeVideoId(url: string): string | null {
  try {
    const videoUrl = new URL(url);

    // Handle youtu.be format
    if (videoUrl.hostname === 'youtu.be') {
      return videoUrl.pathname.slice(1);
    }

    // Handle youtube.com formats including shorts
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
      <section className='relative py-8 lg:py-20 '>
        <div className='max-w-screen-lg mx-auto aspect-video flex items-center justify-center'>
          <p className='text-foreground-subtle'>Invalid video URL</p>
        </div>
      </section>
    );
  }

  return (
    <section className='relative'>
      <div className='aspect-video'>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className='w-full h-full rounded-lg'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Project video'
          loading='lazy'
        />
      </div>
    </section>
  );
}
