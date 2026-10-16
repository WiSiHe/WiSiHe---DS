import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { createFileRoute } from '@tanstack/react-router';
import { createSanityClient, sanityPreviewToken } from '@/lib/sanity/client';
import {
  ISR_BYPASS_COOKIE,
  isrBypassToken,
  perspectiveCookieName,
  previewCookieAttributes,
  SANITY_PREVIEW_COOKIE,
} from '@/lib/sanity/draftMode';

function buildSetCookie(name: string, value: string, isProduction: boolean): string {
  const attrs = previewCookieAttributes(isProduction);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'HttpOnly',
    `Path=${attrs.path}`,
    `Max-Age=${attrs.maxAge}`,
    `SameSite=${attrs.sameSite}`,
  ];
  if (attrs.secure) parts.push('Secure');
  return parts.join('; ');
}

export const Route = createFileRoute('/api/draft-mode/enable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = sanityPreviewToken();
        if (!token) {
          return new Response('Preview token not configured', { status: 503 });
        }

        const client = createSanityClient({ preview: true }).withConfig({ token });
        const {
          isValid,
          redirectTo = '/',
          studioPreviewPerspective,
        } = await validatePreviewUrl(client, request.url);

        if (!isValid) {
          return new Response('Invalid secret', { status: 401 });
        }

        const isProduction = import.meta.env.PROD;
        const headers = new Headers();
        headers.append('Set-Cookie', buildSetCookie(SANITY_PREVIEW_COOKIE, '1', isProduction));

        const bypassToken = isrBypassToken();
        if (bypassToken) {
          headers.append(
            'Set-Cookie',
            buildSetCookie(ISR_BYPASS_COOKIE, bypassToken, isProduction),
          );
        }

        if (studioPreviewPerspective) {
          headers.append(
            'Set-Cookie',
            buildSetCookie(perspectiveCookieName, studioPreviewPerspective, isProduction),
          );
        }

        headers.set('Location', redirectTo);
        return new Response(null, { status: 307, headers });
      },
    },
  },
});
