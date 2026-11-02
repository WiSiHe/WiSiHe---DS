'use client';

import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useEffect, useState } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import {
  incrementPaintingLike,
  incrementPhotographyLike,
  incrementProjectLike,
  incrementVideoLike,
  removePaintingLike,
  removePhotographyLike,
  removeProjectLike,
  removeVideoLike,
} from '@/server/engagement';

type LikeKind = 'painting' | 'project' | 'video' | 'photography';

const KIND_CONFIG = {
  painting: {
    storageKey: 'likedPaintings',
    like: incrementPaintingLike,
    unlike: removePaintingLike,
    liked: AnalyticsEvent.PAINTING_LIKED,
    unliked: AnalyticsEvent.PAINTING_UNLIKED,
    idProp: 'painting_id',
  },
  project: {
    storageKey: 'likedProjects',
    like: incrementProjectLike,
    unlike: removeProjectLike,
    liked: AnalyticsEvent.PROJECT_LIKED,
    unliked: AnalyticsEvent.PROJECT_UNLIKED,
    idProp: 'project_id',
  },
  video: {
    storageKey: 'likedVideos',
    like: incrementVideoLike,
    unlike: removeVideoLike,
    liked: AnalyticsEvent.VIDEO_LIKED,
    unliked: AnalyticsEvent.VIDEO_UNLIKED,
    idProp: 'video_id',
  },
  photography: {
    storageKey: 'likedPhotography',
    like: incrementPhotographyLike,
    unlike: removePhotographyLike,
    liked: AnalyticsEvent.PHOTOGRAPHY_LIKED,
    unliked: AnalyticsEvent.PHOTOGRAPHY_UNLIKED,
    idProp: 'photography_id',
  },
} as const;

type LikeButtonProps = {
  kind: LikeKind;
  documentId: string;
  title: string;
  likesCount?: number | null;
  fullWidth?: boolean;
  className?: string;
};

function getViewerId(): string {
  try {
    let id = localStorage.getItem('viewerId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('viewerId', id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function readLiked(storageKey: string): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

function writeLiked(storageKey: string, documentId: string, liked: boolean) {
  try {
    const next = readLiked(storageKey);
    if (liked) next[documentId] = true;
    else delete next[documentId];
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function LikeButton({
  kind,
  documentId,
  title,
  likesCount,
  fullWidth,
  className,
}: LikeButtonProps) {
  const config = KIND_CONFIG[kind];
  const [count, setCount] = useState(likesCount ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setHasLiked(Boolean(readLiked(config.storageKey)[documentId]));
  }, [config.storageKey, documentId]);

  const handleClick = async () => {
    if (isPending) return;
    setIsPending(true);

    const nextLiked = !hasLiked;
    // Optimistic update, rolled back if the write fails.
    setHasLiked(nextLiked);
    setCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));
    writeLiked(config.storageKey, documentId, nextLiked);
    trackEvent(nextLiked ? config.liked : config.unliked, { [config.idProp]: documentId, title });

    const request = nextLiked ? config.like : config.unlike;
    const result = await request({ data: { documentId, likerId: getViewerId() } });
    if (!result.success) {
      setHasLiked(!nextLiked);
      setCount(prev => Math.max(0, prev + (nextLiked ? -1 : 1)));
      writeLiked(config.storageKey, documentId, !nextLiked);
    }
    setIsPending(false);
  };

  return (
    <button
      type='button'
      onClick={() => void handleClick()}
      disabled={isPending}
      aria-pressed={hasLiked}
      aria-label={`${hasLiked ? 'Unlike' : 'Like'} ${title}, ${count} ${count === 1 ? 'like' : 'likes'}`}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-60',
        fullWidth && 'w-full',
        hasLiked
          ? 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20'
          : 'border-border bg-surface text-foreground-subtle hover:border-foreground-muted hover:text-foreground',
        className,
      )}
    >
      {hasLiked ? (
        <IconHeartFilled className='size-4' stroke={2} aria-hidden />
      ) : (
        <IconHeart className='size-4' stroke={2} aria-hidden />
      )}
      <span aria-hidden>{count}</span>
    </button>
  );
}
