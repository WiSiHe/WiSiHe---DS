'use client';

import { IconEye, IconHeart, IconHeartFilled, IconShare } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  incrementPhotographyLike,
  incrementPhotographyView,
  removePhotographyLike,
} from '@/app/actions';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type PhotographyActionsProps = {
  photoId: string;
  title: string;
  viewsCount: number;
  likesCount: number;
  layout?: 'bar' | 'sidebar';
};

export function PhotographyActions({
  photoId,
  title,
  viewsCount,
  likesCount,
  layout = 'bar',
}: PhotographyActionsProps) {
  const [localViews, setLocalViews] = useState(viewsCount ?? 0);
  const [localLikes, setLocalLikes] = useState(likesCount ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('likedPhotography') || '{}');
      if (liked[photoId]) setHasLiked(true);
    } catch {
      /* ignore */
    }
  }, [photoId]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    // v2: previous key was set even when Sanity .inc() failed for missing viewsCount
    const storageKey = `viewed_photography_v2_${photoId}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      /* private browsing — still attempt to count */
    }

    setLocalViews(prev => prev + 1);
    trackEvent(AnalyticsEvent.PHOTOGRAPHY_VIEWED, { photography_id: photoId, title });
    void incrementPhotographyView(photoId).then(result => {
      if (!result.success) return;
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
    });
  }, [photoId, title]);

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
      setLocalLikes(prev => Math.max(0, prev - 1));
      setHasLiked(false);
      try {
        const liked = JSON.parse(localStorage.getItem('likedPhotography') || '{}');
        delete liked[photoId];
        localStorage.setItem('likedPhotography', JSON.stringify(liked));
      } catch {
        /* ignore */
      }
      trackEvent(AnalyticsEvent.PHOTOGRAPHY_UNLIKED, { photography_id: photoId, title });
      await removePhotographyLike(photoId, likerId);
    } else {
      setLocalLikes(prev => prev + 1);
      setHasLiked(true);
      try {
        const liked = JSON.parse(localStorage.getItem('likedPhotography') || '{}');
        liked[photoId] = true;
        localStorage.setItem('likedPhotography', JSON.stringify(liked));
      } catch {
        /* ignore */
      }
      trackEvent(AnalyticsEvent.PHOTOGRAPHY_LIKED, { photography_id: photoId, title });
      await incrementPhotographyLike(photoId, likerId);
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
          {localViews} views
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
            'flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150',
            layout === 'sidebar' && 'w-full',
            hasLiked
              ? 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20'
              : 'border-border bg-surface text-foreground-subtle hover:border-foreground-muted hover:text-foreground',
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
