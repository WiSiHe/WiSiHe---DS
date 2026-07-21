'use server';

import { draftMode } from 'next/headers';
import { client } from '@/sanity/lib/client';

/**
 * Views are tracked via PostHog on the client side.
 * This action just increments the viewsCount integer — no more array writes.
 * Deduplication is handled client-side via localStorage.
 *
 * Sanity rejects `.inc()` when the field is absent *or* explicitly `null`.
 * `setIfMissing` only covers the absent case, so null/non-numeric needs a set.
 */
async function incrementViewsCount(documentId: string) {
  const current = await client
    .withConfig({ useCdn: false })
    .fetch<number | null>(`*[_id == $id][0].viewsCount`, { id: documentId });

  if (typeof current === 'number' && Number.isFinite(current)) {
    await client.patch(documentId).inc({ viewsCount: 1 }).commit();
    return;
  }

  await client.patch(documentId).set({ viewsCount: 1 }).commit();
}

export async function incrementPaintingView(paintingId: string) {
  try {
    await incrementViewsCount(paintingId);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment painting view:', error);
    return { success: false };
  }
}

export async function incrementPaintingLike(paintingId: string, likerId: string) {
  try {
    await client
      .patch(paintingId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        {
          _key: crypto.randomUUID(),
          likerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to increment painting like:', error);
    return { success: false };
  }
}

export async function removePaintingLike(paintingId: string, likerId: string) {
  try {
    await client
      .patch(paintingId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to remove painting like:', error);
    return { success: false };
  }
}

export async function incrementProjectView(projectId: string) {
  try {
    await incrementViewsCount(projectId);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment project view:', error);
    return { success: false };
  }
}

export async function incrementProjectLike(projectId: string, likerId: string) {
  try {
    await client
      .patch(projectId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        {
          _key: crypto.randomUUID(),
          likerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to increment project like:', error);
    return { success: false };
  }
}

export async function removeProjectLike(projectId: string, likerId: string) {
  try {
    await client
      .patch(projectId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to remove project like:', error);
    return { success: false };
  }
}

export async function incrementVideoView(videoId: string) {
  try {
    await incrementViewsCount(videoId);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment video view:', error);
    return { success: false };
  }
}

export async function incrementVideoLike(videoId: string, likerId: string) {
  try {
    await client
      .patch(videoId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        { _key: crypto.randomUUID(), likerId, timestamp: new Date().toISOString() },
      ])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to increment video like:', error);
    return { success: false };
  }
}

export async function removeVideoLike(videoId: string, likerId: string) {
  try {
    await client
      .patch(videoId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to remove video like:', error);
    return { success: false };
  }
}

export async function incrementPhotographyView(photographyId: string) {
  try {
    await incrementViewsCount(photographyId);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment photography view:', error);
    return { success: false };
  }
}

export async function incrementPhotographyLike(photographyId: string, likerId: string) {
  try {
    await client
      .patch(photographyId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        { _key: crypto.randomUUID(), likerId, timestamp: new Date().toISOString() },
      ])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to increment photography like:', error);
    return { success: false };
  }
}

export async function removePhotographyLike(photographyId: string, likerId: string) {
  try {
    await client
      .patch(photographyId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to remove photography like:', error);
    return { success: false };
  }
}

export async function incrementRecipeView(recipeId: string) {
  try {
    await incrementViewsCount(recipeId);
    return { success: true };
  } catch (error) {
    console.error('Failed to increment recipe view:', error);
    return { success: false };
  }
}

type RecipeRatingEntry = {
  raterId?: string;
  value?: number;
};

function computeRatingStats(ratings: RecipeRatingEntry[]) {
  const valid = ratings.filter(
    (entry): entry is { raterId: string; value: number } =>
      typeof entry.raterId === 'string' &&
      typeof entry.value === 'number' &&
      entry.value >= 1 &&
      entry.value <= 5,
  );
  if (valid.length === 0) {
    return { averageRating: null, ratingCount: 0 };
  }
  const sum = valid.reduce((total, entry) => total + entry.value, 0);
  const averageRating = Math.round((sum / valid.length) * 10) / 10;
  return { averageRating, ratingCount: valid.length };
}

export async function rateRecipe(
  recipeId: string,
  recipeSlug: string,
  raterId: string,
  value: number,
) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return { success: false as const, error: 'Invalid rating' };
  }

  try {
    const existing = await client.fetch<{ ratings?: RecipeRatingEntry[] }>(
      `*[_type == "recipe" && _id == $id][0]{ ratings }`,
      { id: recipeId },
    );

    const withoutRater = (existing?.ratings ?? []).filter(entry => entry.raterId !== raterId);
    const updated = [
      ...withoutRater,
      {
        _key: crypto.randomUUID(),
        raterId,
        value,
        timestamp: new Date().toISOString(),
      },
    ];
    const { averageRating, ratingCount } = computeRatingStats(updated);

    await client
      .patch(recipeId)
      .set({
        ratings: updated,
        averageRating,
        ratingCount,
      })
      .commit({ autoGenerateArrayKeys: true });

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/recipes/${recipeSlug}`);

    return {
      success: true as const,
      averageRating,
      ratingCount,
      userRating: value,
    };
  } catch (error) {
    console.error('Failed to rate recipe:', error);
    return { success: false as const, error: 'Failed to save rating' };
  }
}

export async function disableDraftMode() {
  (await draftMode()).disable();
}
