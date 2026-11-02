'use client';

import { IconEye, IconStar, IconStarFilled } from '@tabler/icons-react';
import { cn } from '@wisihe/utils';
import { useEffect, useRef, useState } from 'react';
import { AnalyticsEvent, trackEvent } from '@/lib/analytics/posthog';
import { incrementRecipeView, rateRecipe } from '@/server/engagement';

type RecipeEngagementProps = {
  recipeId: string;
  title: string;
  viewsCount: number;
  averageRating: number | null;
  ratingCount: number;
  className?: string;
};

function formatRating(value: number | null): string {
  return value == null || value <= 0 ? '—' : value.toFixed(1);
}

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

function readStoredRatings(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem('ratedRecipes') || '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function storeRating(recipeId: string, value: number) {
  try {
    localStorage.setItem(
      'ratedRecipes',
      JSON.stringify({ ...readStoredRatings(), [recipeId]: value }),
    );
  } catch {
    // ignore
  }
}

export function RecipeEngagement({
  recipeId,
  title,
  viewsCount,
  averageRating,
  ratingCount,
  className,
}: RecipeEngagementProps) {
  const [views, setViews] = useState(viewsCount);
  const [average, setAverage] = useState(averageRating);
  const [count, setCount] = useState(ratingCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const stored = readStoredRatings()[recipeId];
    setUserRating(typeof stored === 'number' && stored >= 1 && stored <= 5 ? stored : null);
  }, [recipeId]);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    const storageKey = `viewed_recipe_v2_${recipeId}`;
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      // private browsing: still attempt to count
    }

    setViews(prev => prev + 1);
    trackEvent(AnalyticsEvent.RECIPE_VIEWED, { recipe_id: recipeId, title });
    void incrementRecipeView({ data: { documentId: recipeId } }).then(result => {
      if (!result.success) return;
      try {
        localStorage.setItem(storageKey, '1');
      } catch {
        // ignore
      }
    });
  }, [recipeId, title]);

  const handleRate = async (value: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const previous = { rating: userRating, average, count };
    const isNewRater = previous.rating == null;

    // Optimistic update, replaced by the server's aggregate (or rolled back) below.
    setUserRating(value);
    storeRating(recipeId, value);
    if (isNewRater) {
      const nextCount = previous.count + 1;
      setCount(nextCount);
      setAverage(
        previous.average == null
          ? value
          : Math.round(((previous.average * previous.count + value) / nextCount) * 10) / 10,
      );
    }

    trackEvent(AnalyticsEvent.RECIPE_RATED, {
      recipe_id: recipeId,
      title,
      rating: value,
      is_update: !isNewRater,
    });

    const result = await rateRecipe({ data: { recipeId, raterId: getViewerId(), value } });
    if (!result.success) {
      setUserRating(previous.rating);
      setAverage(previous.average);
      setCount(previous.count);
      if (previous.rating != null) storeRating(recipeId, previous.rating);
    } else {
      setAverage(result.averageRating);
      setCount(result.ratingCount);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={cn('space-y-2 print:hidden', className)}>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <fieldset
          className='m-0 flex min-w-0 items-center border-0 p-0'
          aria-label='Rate this recipe'
        >
          {[1, 2, 3, 4, 5].map(star => {
            const filled = star <= (hoverRating ?? userRating ?? Math.round(average ?? 0));
            return (
              <button
                key={star}
                type='button'
                disabled={isSubmitting}
                className={cn(
                  'flex size-6 items-center justify-center rounded transition-colors disabled:opacity-50',
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
        </fieldset>
        <p className='text-sm text-foreground-subtle'>
          <span className='font-semibold text-foreground'>{formatRating(average)}</span>
          <span className='text-foreground-muted'>
            {count > 0 ? ` · ${count} rating${count === 1 ? '' : 's'}` : ' · Be the first to rate'}
          </span>
          {userRating ? (
            <span className='text-foreground-muted'> · You rated {userRating}/5</span>
          ) : null}
        </p>
      </div>
      <p className='flex items-center gap-1.5 text-xs text-foreground-muted'>
        <IconEye className='size-3.5' stroke={2} aria-hidden />
        {views} view{views === 1 ? '' : 's'}
      </p>
    </div>
  );
}
