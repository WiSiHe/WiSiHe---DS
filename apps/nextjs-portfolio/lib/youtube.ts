/**
 * YouTube Data API v3 utilities.
 * Only runs server-side — the API key is never sent to the browser.
 */

export interface YouTubeStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

/** Extract the YouTube video ID from any supported URL format */
export function extractYouTubeId(url: string): string | null {
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

/** Fetch statistics for a single YouTube video. Cached for 1 hour. */
export async function getYouTubeStats(videoId: string): Promise<YouTubeStats | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY is not set');
    return null;
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`,
      {
        // Revalidate every hour — keeps counts fresh without hammering the quota
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      console.error(`YouTube API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    const item = data.items?.[0];
    if (!item) return null;

    return {
      viewCount: parseInt(item.statistics?.viewCount ?? '0', 10),
      likeCount: parseInt(item.statistics?.likeCount ?? '0', 10),
      commentCount: parseInt(item.statistics?.commentCount ?? '0', 10),
    };
  } catch (err) {
    console.error('Failed to fetch YouTube stats:', err);
    return null;
  }
}

/** Format a large number into a readable string: 1,234,567 → "1.2M" */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
