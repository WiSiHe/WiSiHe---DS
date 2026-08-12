import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getSanityWriteClient, sanityReadClient } from '../lib/sanity-write';

const documentIdInput = z.object({ documentId: z.string().min(1) });
const likeInput = z.object({
  documentId: z.string().min(1),
  likerId: z.string().min(1),
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

export const incrementPaintingLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    const writeClient = getSanityWriteClient();
    if (!writeClient) {
      return { success: false as const, error: 'Sanity write token not configured' };
    }

    try {
      await writeClient
        .patch(data.documentId)
        .setIfMissing({ likes: [] })
        .insert('after', 'likes[-1]', [
          {
            _key: crypto.randomUUID(),
            likerId: data.likerId,
            timestamp: new Date().toISOString(),
          },
        ])
        .commit({ autoGenerateArrayKeys: true });
      return { success: true as const };
    } catch (error) {
      console.error('Failed to increment painting like:', error);
      return { success: false as const, error: 'Failed to like painting' };
    }
  });

export const removePaintingLike = createServerFn({ method: 'POST' })
  .validator(likeInput)
  .handler(async ({ data }) => {
    const writeClient = getSanityWriteClient();
    if (!writeClient) {
      return { success: false as const, error: 'Sanity write token not configured' };
    }

    try {
      await writeClient
        .patch(data.documentId)
        .unset([`likes[likerId=="${data.likerId}"]`])
        .commit({ autoGenerateArrayKeys: true });
      return { success: true as const };
    } catch (error) {
      console.error('Failed to remove painting like:', error);
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
