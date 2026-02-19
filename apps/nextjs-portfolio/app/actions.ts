'use server';

import { client } from '@/sanity/lib/client';
import { draftMode } from 'next/headers';

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

export async function disableDraftMode() {
  (await draftMode()).disable();
}
