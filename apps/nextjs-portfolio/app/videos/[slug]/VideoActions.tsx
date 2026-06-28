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
}

export default function VideoActions({
  videoId,
  title,
  viewsCount,
  likesCount,
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
    const storageKey = `viewed_video_${videoId}`;
    try {
      if (localStorage.getItem(storageKey)) return;
      hasTrackedView.current = true;
      localStorage.setItem(storageKey, '1');
      trackEvent(AnalyticsEvent.VIDEO_VIEWED, { video_id: videoId, title });
      void incrementVideoView(videoId);
    } catch {
      trackEvent(AnalyticsEvent.VIDEO_VIEWED, { video_id: videoId, title });
      void incrementVideoView(videoId);
    }
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
    <div className='flex items-center flex-wrap gap-4'>
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

      <div className='flex items-center gap-2 ml-auto'>
        <button
          type='button'
          onClick={handleLike}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150',
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
          className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border bg-surface text-foreground-subtle hover:text-foreground hover:border-foreground-muted transition-colors duration-150'
        >
          <IconShare className='size-4' stroke={2} aria-hidden />
          {shareText}
        </button>
      </div>
    </div>
  );
}
