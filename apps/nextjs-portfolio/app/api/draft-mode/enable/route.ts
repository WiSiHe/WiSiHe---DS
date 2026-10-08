import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { client } from '@/sanity/lib/client';
import { token } from '@/sanity/lib/token';

const enableDraftMode = defineEnableDraftMode({
  client: client.withConfig({ token }),
});

export async function GET(request: Request) {
  const url = new URL(request.url);

  // If a valid sanity-preview-secret query parameter exists (Sanity Studio presentation tool),
  // delegate to next-sanity's built-in validation
  if (url.searchParams.has('sanity-preview-secret')) {
    return enableDraftMode.GET(request);
  }

  // In local development or when called directly (e.g. from wisihe-ai live preview),
  // enable draft mode directly and redirect to the target path
  if (
    process.env.NODE_ENV === 'development' ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1'
  ) {
    const draft = await draftMode();
    if (!draft.isEnabled) {
      draft.enable();
    }

    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get('__prerender_bypass');
    if (bypassCookie) {
      cookieStore.set({
        name: '__prerender_bypass',
        value: bypassCookie.value,
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'lax',
      });
    }

    const redirectTo = url.searchParams.get('redirect') || '/';
    return redirect(redirectTo);
  }

  return enableDraftMode.GET(request);
}
