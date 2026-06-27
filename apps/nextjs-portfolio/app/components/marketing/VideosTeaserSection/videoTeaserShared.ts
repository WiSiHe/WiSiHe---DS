import type { HomeExtrasQueryResult } from '@wisihe/sanity-queries';

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
