'use client';

import { IconEye, IconShare, IconStar, IconStarFilled } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { incrementRecipeView, rateRecipe } from '@/app/actions';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';

type RecipeEngagementProps = {
  recipeId: string;
  recipeSlug: string;
  title: string;
  viewsCount: number;
  averageRating: number | null;
  ratingCount: number;
  className?: string;
};

function formatRating(value: number | null): string {
  if (value == null || value <= 0) return '—';
  return value.toFixed(1);
}

function generateOrRetrieveViewerId(): string {
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

function readStoredRating(recipeId: string): number | null {
  try {
    const stored = JSON.parse(localStorage.getItem('ratedRecipes') || '{}') as Record<
      string,
      number
    >;
    const value = stored[recipeId];
    return typeof value === 'number' && value >= 1 && value <= 5 ? value : null;
  } catch {
    return null;
  }
}

function storeRating(recipeId: string, value: number) {
  try {
    const stored = JSON.parse(localStorage.getItem('ratedRecipes') || '{}') as Record<
      string,
      number
    >;
    stored[recipeId] = value;
    localStorage.setItem('ratedRecipes', JSON.stringify(stored));
  } catch {
    /* ignore */
  }
}

export default function RecipeEngagement({
  recipeId,
  recipeSlug,
  title,
  viewsCount,
  averageRating,
  ratingCount,
  className,
}: RecipeEngagementProps) {
  const [localViews, setLocalViews] = useState(viewsCount ?? 0);
  const [localAverage, setLocalAverage] = useState(averageRating);
  const [localCount, setLocalCount] = useState(ratingCount ?? 0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    setUserRating(readStoredRating(recipeId));
  }, [recipeId]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    const storageKey = `viewed_recipe_${recipeId}`;
    try {
      if (localStorage.getItem(storageKey)) return;
      hasTrackedView.current = true;
      localStorage.setItem(storageKey, '1');
      setLocalViews(prev => prev + 1);
      trackEvent(AnalyticsEvent.RECIPE_VIEWED, { recipe_id: recipeId, title });
      void incrementRecipeView(recipeId);
    } catch {
      trackEvent(AnalyticsEvent.RECIPE_VIEWED, { recipe_id: recipeId, title });
      void incrementRecipeView(recipeId);
    }
  }, [recipeId, title]);

  const handleRate = useCallback(
    async (value: number) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const previousRating = userRating;
      const previousAverage = localAverage;
      const previousCount = localCount;
      const raterId = generateOrRetrieveViewerId();
      const isNewRater = previousRating == null;

      setUserRating(value);
      storeRating(recipeId, value);

      if (isNewRater) {
        const nextCount = previousCount + 1;
        const nextAverage =
          previousAverage == null
            ? value
            : Math.round(((previousAverage * previousCount + value) / nextCount) * 10) / 10;
        setLocalCount(nextCount);
        setLocalAverage(nextAverage);
      } else {
        const nextAverage =
          previousCount <= 1
            ? value
            : Math.round(
                (((previousAverage ?? 0) * previousCount - previousRating + value) /
                  previousCount) *
                  10,
              ) / 10;
        setLocalAverage(nextAverage);
      }

      trackEvent(AnalyticsEvent.RECIPE_RATED, {
        recipe_id: recipeId,
        title,
        rating: value,
        is_update: !isNewRater,
      });

      const result = await rateRecipe(recipeId, recipeSlug, raterId, value);
      if (!result.success) {
        setUserRating(previousRating);
        setLocalAverage(previousAverage);
        setLocalCount(previousCount);
        if (previousRating != null) {
          storeRating(recipeId, previousRating);
        }
      } else if (result.averageRating != null) {
        setLocalAverage(result.averageRating);
        setLocalCount(result.ratingCount);
      }

      setIsSubmitting(false);
    },
    [isSubmitting, localAverage, localCount, recipeId, recipeSlug, title, userRating],
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* ignore */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareText('Copied!');
      setTimeout(() => setShareText('Share'), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border border-border/20 bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className='space-y-2'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <div className='flex items-center gap-1' role='group' aria-label='Rate this recipe'>
            {[1, 2, 3, 4, 5].map(star => {
              const filled = star <= (hoverRating ?? userRating ?? Math.round(localAverage ?? 0));
              return (
                <button
                  key={star}
                  type='button'
                  disabled={isSubmitting}
                  className={cn(
                    'rounded p-0.5 transition-colors disabled:opacity-50',
                    filled ? 'text-accent' : 'text-foreground-muted hover:text-accent/70',
                  )}
                  aria-label={`Rate ${star} out of 5 stars`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(null)}
                  onClick={() => void handleRate(star)}
                >
                  {filled ? (
                    <IconStarFilled className='size-5' stroke={2} aria-hidden />
                  ) : (
                    <IconStar className='size-5' stroke={2} aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
          <p className='text-sm text-foreground-subtle'>
            <span className='font-semibold text-foreground'>{formatRating(localAverage)}</span>
            {localCount > 0 ? (
              <span className='text-foreground-muted'>
                {' '}
                · {localCount} rating{localCount === 1 ? '' : 's'}
              </span>
            ) : (
              <span className='text-foreground-muted'> · Be the first to rate</span>
            )}
            {userRating ? (
              <span className='text-foreground-muted'> · You rated {userRating}/5</span>
            ) : null}
          </p>
        </div>
        <p className='flex items-center gap-1.5 text-xs text-foreground-muted'>
          <IconEye className='size-3.5' stroke={2} aria-hidden />
          {localViews} view{localViews === 1 ? '' : 's'}
        </p>
      </div>

      <button
        type='button'
        onClick={() => void handleShare()}
        className='inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground-subtle transition-colors hover:border-foreground-muted hover:text-foreground sm:self-center'
      >
        <IconShare className='size-4' stroke={2} aria-hidden />
        {shareText}
      </button>

      {/* Hidden summary for crawlers that read visible aggregate text */}
      {localCount > 0 && localAverage != null ? (
        <p className='sr-only'>
          Average rating {formatRating(localAverage)} out of 5 based on {localCount} ratings
        </p>
      ) : null}
    </div>
  );
}
