'use client';

import { IconEye, IconHeart, IconHeartFilled, IconShare } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { incrementVideoLike, incrementVideoView, removeVideoLike } from '@/app/actions';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

interface VideoActionsProps {
  videoId: string;
  title: string;
  viewsCount: number;
  likesCount: number;
  layout?: 'bar' | 'sidebar';
}

export default function VideoActions({
  videoId,
  title,
  viewsCount,
  likesCount,
  layout = 'bar',
}: VideoActionsProps) {
  const [localLikes, setLocalLikes] = useState(likesCount ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('likedVideos') || '{}');
      if (liked[videoId]) setHasLiked(true);
    } catch {
      /* ignore */
    }
  }, [videoId]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    // v2: previous key was set even when Sanity .inc() failed for missing viewsCount
    const storageKey = `viewed_video_v2_${videoId}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      /* private browsing — still attempt to count */
    }

    trackEvent(AnalyticsEvent.VIDEO_VIEWED, { video_id: videoId, title });
    void incrementVideoView(videoId).then(result => {
      if (!result.success) return;
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
    });
  }, [videoId, title]);

  const generateOrRetrieveViewerId = useCallback((): string => {
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
  }, []);

  const handleLike = async () => {
    const likerId = generateOrRetrieveViewerId();
    if (hasLiked) {
      setLocalLikes(p => Math.max(0, p - 1));
      setHasLiked(false);
      try {
        const liked = JSON.parse(localStorage.getItem('likedVideos') || '{}');
        delete liked[videoId];
        localStorage.setItem('likedVideos', JSON.stringify(liked));
      } catch {
        /* ignore */
      }
      trackEvent(AnalyticsEvent.VIDEO_UNLIKED, { video_id: videoId, title });
      await removeVideoLike(videoId, likerId);
    } else {
      setLocalLikes(p => p + 1);
      setHasLiked(true);
      try {
        const liked = JSON.parse(localStorage.getItem('likedVideos') || '{}');
        liked[videoId] = true;
        localStorage.setItem('likedVideos', JSON.stringify(liked));
      } catch {
        /* ignore */
      }
      trackEvent(AnalyticsEvent.VIDEO_LIKED, { video_id: videoId, title });
      await incrementVideoLike(videoId, likerId);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* ignore */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share'), 2500);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div
      className={cn(
        'flex gap-4',
        layout === 'sidebar' ? 'flex-col items-stretch' : 'flex-wrap items-center',
      )}
    >
      <div className='flex items-center gap-4 text-sm text-foreground-muted'>
        <span className='flex items-center gap-1.5'>
          <IconEye className='size-3.5' stroke={2} aria-hidden />
          {viewsCount} views
        </span>
        <span className={cn('flex items-center gap-1.5', hasLiked && 'text-red-500')}>
          {hasLiked ? (
            <IconHeartFilled className='size-3.5' stroke={2} aria-hidden />
          ) : (
            <IconHeart className='size-3.5' stroke={2} aria-hidden />
          )}
          {localLikes} likes
        </span>
      </div>

      <div
        className={cn(
          'flex items-center gap-2',
          layout === 'sidebar' ? 'grid w-full grid-cols-2' : 'ml-auto',
        )}
      >
        <button
          type='button'
          onClick={handleLike}
          className={cn(
            'flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors duration-150',
            layout === 'sidebar' && 'w-full',
            hasLiked
              ? 'text-red-500 border-red-500/20 bg-red-500/10 hover:bg-red-500/20'
              : 'border-border bg-surface text-foreground-subtle hover:text-foreground hover:border-foreground-muted',
          )}
        >
          {hasLiked ? (
            <IconHeartFilled className='size-4' stroke={2} aria-hidden />
          ) : (
            <IconHeart className='size-4' stroke={2} aria-hidden />
          )}
          {hasLiked ? 'Liked' : 'Like'}
        </button>
        <button
          type='button'
          onClick={handleShare}
          className={cn(
            'flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground-subtle transition-colors duration-150 hover:border-foreground-muted hover:text-foreground',
            layout === 'sidebar' && 'w-full',
          )}
        >
          <IconShare className='size-4' stroke={2} aria-hidden />
          {shareText}
        </button>
      </div>
    </div>
  );
}
