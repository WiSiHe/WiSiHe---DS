import { createFileRoute } from '@tanstack/react-router';
import {
  perspectiveCookieName,
  previewCookieAttributes,
  SANITY_PREVIEW_COOKIE,
} from '@/lib/sanity/draftMode';

function buildClearCookie(name: string, isProduction: boolean): string {
  const attrs = previewCookieAttributes(isProduction);
  const parts = [
    `${name}=`,
    'HttpOnly',
    `Path=${attrs.path}`,
    'Max-Age=0',
    `SameSite=${attrs.sameSite}`,
  ];
  if (attrs.secure) parts.push('Secure');
  return parts.join('; ');
}

export const Route = createFileRoute('/api/draft-mode/disable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const isProduction = import.meta.env.PROD;
        const url = new URL(request.url);
        const redirectTo = url.searchParams.get('redirect') || '/';

        const headers = new Headers();
        headers.append('Set-Cookie', buildClearCookie(SANITY_PREVIEW_COOKIE, isProduction));
        headers.append('Set-Cookie', buildClearCookie(perspectiveCookieName, isProduction));
        headers.set('Location', redirectTo);

        return new Response(null, { status: 307, headers });
      },
    },
  },
});
