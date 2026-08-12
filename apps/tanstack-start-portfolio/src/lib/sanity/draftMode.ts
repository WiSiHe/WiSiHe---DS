import { perspectiveCookieName } from '@sanity/preview-url-secret/constants';

/** Cookie set by `/api/draft-mode/enable` when Sanity preview is active. */
export const SANITY_PREVIEW_COOKIE = '__sanity_preview';

export { perspectiveCookieName };

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

export function isPreviewEnabled(request?: Request | null): boolean {
  if (!request) return false;
  const cookies = parseCookieHeader(request.headers.get('cookie'));
  return cookies[SANITY_PREVIEW_COOKIE] === '1' || Boolean(cookies[perspectiveCookieName]);
}

export function getPreviewPerspective(request?: Request | null): 'previewDrafts' | 'published' {
  if (!isPreviewEnabled(request)) return 'published';
  return 'previewDrafts';
}

export function previewCookieAttributes(isProduction: boolean) {
  return {
    httpOnly: true,
    path: '/',
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 60 * 60 * 24 * 7,
  };
}
