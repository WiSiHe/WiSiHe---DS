'use server';

import { draftMode } from 'next/headers';
import { client } from '@/sanity/lib/client';

/**
 * Views are tracked via PostHog on the client side.
 * This action just increments the viewsCount integer — no more array writes.
 * Deduplication is handled client-side via localStorage.
 */
export async function incrementPaintingView(paintingId: string) {
  try {
    await client.patch(paintingId).inc({ viewsCount: 1 }).commit();
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
    await client.patch(projectId).inc({ viewsCount: 1 }).commit();
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

export async function disableDraftMode() {
  (await draftMode()).disable();
}
