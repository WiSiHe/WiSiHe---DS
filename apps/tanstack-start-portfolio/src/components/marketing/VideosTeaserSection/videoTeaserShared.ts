import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { urlForImage } from '@/lib/sanity';
import { buildSrcSet } from '@/lib/sanityImageSrcSet';

export type VideoItem = NonNullable<HomeExtrasQueryResult>['videos'][number];

const CATEGORY_MAP: Record<string, string> = {
  'Time-lapse': 'Timelapse',
  Animation: 'Animation',
  Rotoscope: 'Animation',
  'Unreal Engine 4': '3D / UE4',
  'Unreal Engine 5': '3D / UE4',
  Game: 'Game Dev',
  Unity: 'Game Dev',
  Flash: 'Game Dev',
  Babel: 'Game Dev',
};

export function getVideoCategory(video: VideoItem): string | null {
  for (const tag of video.tags ?? []) {
    const cat = CATEGORY_MAP[tag.name ?? ''];
    if (cat) return cat;
  }
  return (video.tags?.[0]?.name ?? null)?.trim() || null;
}

export function getVideoTitle(video: VideoItem): string {
  return video.title?.trim() || 'Untitled video';
}

export function getVideoHref(slug: string): string {
  return `/videos/${slug}`;
}

export function formatClipCount(count: number): string {
  return count === 1 ? '1 clip' : `${count} clips`;
}

export function splitFeaturedVideos(videos: VideoItem[]) {
  const featured = videos.find(video => video.featured) ?? videos[0];
  if (!featured) return { featured: null, rest: [] as VideoItem[] };
  const rest = videos.filter(video => video._id !== featured._id);
  return { featured, rest };
}

export function getVideoThumbnailSrc(
  video: VideoItem,
  size: 'screen' | 'thumb' = 'screen',
): string | null {
  const builder = urlForImage(video.thumbnail);
  if (!builder) return null;
  if (size === 'thumb') {
    return builder.width(320).height(180).fit('crop').quality(75).auto('format').url();
  }
  return builder.width(1280).height(720).fit('crop').quality(85).auto('format').url();
}

/** Responsive candidates matching `getVideoThumbnailSrc` (same 16:9 crop). */
export function getVideoThumbnailSrcSet(
  video: VideoItem,
  size: 'screen' | 'thumb' = 'screen',
): string | undefined {
  const widths = size === 'thumb' ? [128, 192, 320] : [640, 960, 1280];
  const quality = size === 'thumb' ? 75 : 85;
  return buildSrcSet(widths, width =>
    urlForImage(video.thumbnail)
      ?.width(width)
      .height(Math.round((width * 9) / 16))
      .fit('crop')
      .quality(quality)
      .auto('format')
      .url(),
  );
}

export function getVideoDescription(video: VideoItem): string | null {
  const description = video.description?.trim();
  return description || null;
}
