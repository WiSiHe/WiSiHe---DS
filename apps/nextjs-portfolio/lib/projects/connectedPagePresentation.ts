export type ConnectedPageKind = 'live-site' | 'video' | 'guide' | 'playable' | 'gallery';

export type ConnectedPagePresentation = {
  kind: ConnectedPageKind;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

function parseUrl(url: string): URL | null {
  try {
    return new URL(url.trim());
  } catch {
    return null;
  }
}

export function displayHost(url: string): string {
  const parsed = parseUrl(url);
  if (!parsed) return url;
  return parsed.hostname.replace(/^www\./, '');
}

function extractYouTubeId(parsed: URL): string | null {
  const host = parsed.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1).split('/')[0];
    return id || null;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery) return fromQuery;

    const embedMatch = parsed.pathname.match(/^\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) return embedMatch[1];

    const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) return shortsMatch[1];
  }

  return null;
}

export function normalizeExternalUrl(url: string): string | null {
  const parsed = parseUrl(url);
  if (!parsed) return null;

  const youtubeId = extractYouTubeId(parsed);
  if (youtubeId) return `youtube:${youtubeId}`;

  const pathname = parsed.pathname.replace(/\/$/, '') || '/';
  return `${parsed.origin}${pathname}${parsed.search}`;
}

export function isVideoUrl(url: string): boolean {
  const parsed = parseUrl(url);
  if (!parsed) return false;

  const host = parsed.hostname.replace(/^www\./, '');
  return (
    host === 'youtu.be' ||
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'vimeo.com' ||
    host === 'player.vimeo.com'
  );
}

export function isDuplicateOfEmbeddedVideo(
  connectedPage: string,
  connectedVideoUrl?: string | null,
): boolean {
  if (!connectedVideoUrl) return false;

  const pageKey = normalizeExternalUrl(connectedPage);
  const videoKey = normalizeExternalUrl(connectedVideoUrl);
  return pageKey !== null && videoKey !== null && pageKey === videoKey;
}

function detectKind(url: string, parsed: URL): ConnectedPageKind {
  const host = parsed.hostname.replace(/^www\./, '');

  if (isVideoUrl(url)) return 'video';
  if (host.includes('notion.')) return 'guide';
  if (host.includes('play.unity.com') || host.includes('itch.io')) return 'playable';
  if (parsed.pathname.includes('/gallery')) return 'gallery';

  return 'live-site';
}

export function getConnectedPagePresentation(url: string): ConnectedPagePresentation {
  const parsed = parseUrl(url);
  const host = displayHost(url);

  if (!parsed) {
    return {
      kind: 'live-site',
      eyebrow: 'External link',
      title: url,
      description: 'Opens in a new tab.',
      cta: 'Open link',
    };
  }

  const kind = detectKind(url, parsed);

  switch (kind) {
    case 'video': {
      const isYouTube = host === 'youtu.be' || host.includes('youtube');
      return {
        kind,
        eyebrow: 'Video',
        title: isYouTube ? 'YouTube' : host,
        description: isYouTube
          ? 'Watch on YouTube in a new tab.'
          : 'Opens in a new tab — not embedded here for performance and privacy.',
        cta: isYouTube ? 'Watch on YouTube' : 'Watch video',
      };
    }
    case 'guide':
      return {
        kind,
        eyebrow: 'Guide',
        title: host.includes('notion') ? 'Notion' : host,
        description: 'Step-by-step resource — opens in a new tab.',
        cta: 'Open guide',
      };
    case 'playable':
      return {
        kind,
        eyebrow: 'Playable demo',
        title: host,
        description: 'Try the build in your browser — opens in a new tab.',
        cta: 'Play demo',
      };
    case 'gallery':
      return {
        kind,
        eyebrow: 'Gallery',
        title: host,
        description: 'Browse submissions and live work — opens in a new tab.',
        cta: 'View gallery',
      };
    default:
      return {
        kind: 'live-site',
        eyebrow: 'Live site',
        title: host,
        description: 'Opens in a new tab — not embedded for performance and privacy.',
        cta: 'Visit live site',
      };
  }
}
