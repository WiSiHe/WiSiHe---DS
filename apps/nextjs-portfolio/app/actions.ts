'use server';

import { draftMode } from 'next/headers';
import { client } from '@/sanity/lib/client';

export async function incrementPaintingView(paintingId: string, viewerId: string) {
  try {
    const patch = await client
      .patch(paintingId)
      .setIfMissing({ views: [] })
      .insert('after', 'views[-1]', [
        {
          _key: crypto.randomUUID(), // Unique key
          viewerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to increment painting view:', error);
    return { success: false, error: 'Failed to increment view' };
  }
}

export async function incrementPaintingLike(paintingId: string, likerId: string) {
  try {
    const patch = await client
      .patch(paintingId)
      .setIfMissing({ likes: [] })
      .insert('after', 'likes[-1]', [
        {
          _key: crypto.randomUUID(), // Unique key
          likerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to increment painting like:', error);
    return { success: false, error: 'Failed to increment like' };
  }
}

export async function removePaintingLike(paintingId: string, likerId: string) {
  try {
    const patch = await client
      .patch(paintingId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to remove painting like:', error);
    return { success: false, error: 'Failed to remove like' };
  }
}

export async function incrementProjectView(projectId: string, viewerId: string) {
  try {
    const patch = await client
      .patch(projectId)
      .setIfMissing({ views: [] })
      .insert('after', 'views[-1]', [
        {
          _key: crypto.randomUUID(),
          viewerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to increment project view:', error);
    return { success: false, error: 'Failed to increment view' };
  }
}

export async function incrementProjectLike(projectId: string, likerId: string) {
  try {
    const patch = await client
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

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to increment project like:', error);
    return { success: false, error: 'Failed to increment like' };
  }
}

export async function removeProjectLike(projectId: string, likerId: string) {
  try {
    const patch = await client
      .patch(projectId)
      .unset([`likes[likerId=="${likerId}"]`])
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, patch };
  } catch (error) {
    console.error('Failed to remove project like:', error);
    return { success: false, error: 'Failed to remove like' };
  }
}

export async function disableDraftMode() {
  (await draftMode()).disable();
}
