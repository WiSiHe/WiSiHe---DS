import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getSanityWriteClient, sanityReadClient } from '../lib/sanity-write';

const documentIdInput = z.object({ documentId: z.string().min(1) });
const likeInput = z.object({
  documentId: z.string().min(1),
  // Interpolated into a Sanity array filter, so restrict it to a safe id charset.
  likerId: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/),
});

async function incrementViewsCount(documentId: string) {
  const writeClient = getSanityWriteClient();
  if (!writeClient) {
    return { success: false as const, error: 'Sanity write token not configured' };
  }

  const current = await sanityReadClient
    .withConfig({ useCdn: false })
    .fetch<number | null>(`*[_id == $id][0].viewsCount`, { id: documentId });

  if (typeof current === 'number' && Number.isFinite(current)) {
    await writeClient.patch(documentId).inc({ viewsCount: 1 }).commit();
    return { success: true as const };
  }

  await writeClient.patch(documentId).set({ viewsCount: 1 }).commit();
  return { success: true as const };
}

export const incrementPaintingView = createServerFn({ method: 'POST' })
  .validator(documentIdInput)
  .handler(async ({ data }) => {
    try {
      return await incrementViewsCount(data.documentId);
    } catch (error) {
      console.error('Failed to increment painting view:', error);
      return { success: false as const, error: 'Failed to increment view' };
    }
  });

async function addLike(documentId: string, likerId: string) {
  const writeClient = getSanityWriteClient();
  if (!writeClient) {
    return { success: false as const, error: 'Sanity write token not configured' };
  }

  // Drop any earlier like from this viewer first so a repeated request cannot double count.
  await writeClient
    .patch(documentId)
    .setIfMissing({ likes: [] })
    .unset([`likes[likerId=="${likerId}"]`])
    .insert('after', 'likes[-1]', [
      { _key: crypto.randomUUID(), likerId, timestamp: new Date().toISOString() },
    ])
    .commit({ autoGenerateArrayKeys: true });
  return { success: true as const };
}

async function removeLike(documentId: string, likerId: string) {
  const writeClient = getSanityWriteClient();
  if (!writeClient) {
    return { success: false as const, error: 'Sanity write token not configured' };
  }

  await writeClient
    .patch(documentId)
    .unset([`likes[likerId=="${likerId}"]`])
    .commit({ autoGenerateArrayKeys: true });
  return { success: true as const };
}

export const incrementPaintingLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await addLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to like painting:', error);
      return { success: false as const, error: 'Failed to like painting' };
    }
  });

export const removePaintingLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await removeLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to remove painting like:', error);
      return { success: false as const, error: 'Failed to remove like' };
    }
  });

export const incrementProjectLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await addLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to like project:', error);
      return { success: false as const, error: 'Failed to like project' };
    }
  });

export const removeProjectLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await removeLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to remove project like:', error);
      return { success: false as const, error: 'Failed to remove like' };
    }
  });

export const incrementVideoLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await addLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to like video:', error);
      return { success: false as const, error: 'Failed to like video' };
    }
  });

export const removeVideoLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await removeLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to remove video like:', error);
      return { success: false as const, error: 'Failed to remove like' };
    }
  });

export const incrementPhotographyLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await addLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to like photography:', error);
      return { success: false as const, error: 'Failed to like photography' };
    }
  });

export const removePhotographyLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    try {
      return await removeLike(data.documentId, data.likerId);
    } catch (error) {
      console.error('Failed to remove photography like:', error);
      return { success: false as const, error: 'Failed to remove like' };
    }
  });

export const incrementProjectView = createServerFn({ method: 'POST' })
  .validator(documentIdInput)
  .handler(async ({ data }) => {
    try {
      return await incrementViewsCount(data.documentId);
    } catch (error) {
      console.error('Failed to increment project view:', error);
      return { success: false as const, error: 'Failed to increment view' };
    }
  });

export const incrementVideoView = createServerFn({ method: 'POST' })
  .validator(documentIdInput)
  .handler(async ({ data }) => {
    try {
      return await incrementViewsCount(data.documentId);
    } catch (error) {
      console.error('Failed to increment video view:', error);
      return { success: false as const, error: 'Failed to increment view' };
    }
  });

export const incrementPhotographyView = createServerFn({ method: 'POST' })
  .validator(documentIdInput)
  .handler(async ({ data }) => {
    try {
      return await incrementViewsCount(data.documentId);
    } catch (error) {
      console.error('Failed to increment photography view:', error);
      return { success: false as const, error: 'Failed to increment view' };
    }
  });

export const incrementRecipeView = createServerFn({ method: 'POST' })
  .validator(documentIdInput)
  .handler(async ({ data }) => {
    try {
      return await incrementViewsCount(data.documentId);
    } catch (error) {
      console.error('Failed to increment recipe view:', error);
      return { success: false as const, error: 'Failed to increment view' };
    }
  });

const rateRecipeInput = z.object({
  recipeId: z.string().min(1),
  raterId: z.string().min(1),
  value: z.number().int().min(1).max(5),
});

type RecipeRatingEntry = { raterId?: string; value?: number };

function computeRatingStats(ratings: RecipeRatingEntry[]) {
  const valid = ratings.filter(
    (entry): entry is { raterId: string; value: number } =>
      typeof entry.raterId === 'string' &&
      typeof entry.value === 'number' &&
      entry.value >= 1 &&
      entry.value <= 5,
  );
  if (valid.length === 0) return { averageRating: null, ratingCount: 0 };
  const sum = valid.reduce((total, entry) => total + entry.value, 0);
  return { averageRating: Math.round((sum / valid.length) * 10) / 10, ratingCount: valid.length };
}

export const rateRecipe = createServerFn({ method: 'POST' })
  .validator(rateRecipeInput)
  .handler(async ({ data }) => {
    const writeClient = getSanityWriteClient();
    if (!writeClient) {
      return { success: false as const, error: 'Sanity write token not configured' };
    }

    try {
      const existing = await sanityReadClient
        .withConfig({ useCdn: false })
        .fetch<{ ratings?: RecipeRatingEntry[] } | null>(
          `*[_type == "recipe" && _id == $id][0]{ ratings }`,
          { id: data.recipeId },
        );

      // One rating per viewer: replace any earlier rating from the same rater.
      const updated = [
        ...(existing?.ratings ?? []).filter(entry => entry.raterId !== data.raterId),
        {
          _key: crypto.randomUUID(),
          raterId: data.raterId,
          value: data.value,
          timestamp: new Date().toISOString(),
        },
      ];
      const { averageRating, ratingCount } = computeRatingStats(updated);

      await writeClient
        .patch(data.recipeId)
        .set({ ratings: updated, averageRating, ratingCount })
        .commit({ autoGenerateArrayKeys: true });

      return { success: true as const, averageRating, ratingCount };
    } catch (error) {
      console.error('Failed to rate recipe:', error);
      return { success: false as const, error: 'Failed to save rating' };
    }
  });
