import { getYouTubeId } from '@/lib/youtube';

type EmbeddedVideoProps = {
  videoUrl: string;
};

export function EmbeddedVideo({ videoUrl }: EmbeddedVideoProps) {
  const videoId = getYouTubeId(videoUrl);

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
