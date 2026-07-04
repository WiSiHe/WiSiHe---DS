import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';
import { urlForImage } from '@/sanity/lib/utils';

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

export function getVideoDescription(video: VideoItem): string | null {
  const description = video.description?.trim();
  return description || null;
}
