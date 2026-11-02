import { createClient } from '@sanity/client';
import { REDIRECTS_QUERY } from '@wisihe/sanity-queries';
import {
  sanityApiVersion,
  sanityDataset,
  sanityPreviewToken,
  sanityProjectId,
} from './sanity/client';

export type CmsRedirect = {
  source: string | null;
  destination: string | null;
  permanent: boolean | null;
};

const CACHE_TTL_MS = 60_000;
// Paths that can never be CMS redirects: skip the lookup entirely.
const SKIPPED_PREFIXES = ['/api/', '/_serverFn', '/_build', '/assets/', '/ingest/'];

let cache: { at: number; redirects: CmsRedirect[] } | null = null;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Source paths are `/a/b` or `/blog/:slug`; each `:name` matches one path segment. */
function compileSource(source: string): { regex: RegExp; names: string[] } {
  const names: string[] = [];
  const pattern = source
    .replace(/\/+$/, '')
    .split('/')
    .map(part => {
      if (part.startsWith(':')) {
        names.push(part.slice(1));
        return '([^/]+)';
      }
      return escapeRegex(part);
    })
    .join('/');
  return { regex: new RegExp(`^${pattern}/?$`, 'i'), names };
}

/**
 * Finds the first enabled redirect whose source matches `pathname` and returns where to send the
 * visitor. External (absolute URL) destinations are passed through; `:param` placeholders in the
 * destination are filled from the matched source. Returns null when nothing matches or the redirect
 * would point back at the same path.
 */
export function matchRedirect(
  pathname: string,
  search: string,
  redirects: CmsRedirect[],
): { location: string; status: 301 | 302 } | null {
  for (const redirect of redirects) {
    if (!redirect.source || !redirect.destination) continue;
    const { regex, names } = compileSource(redirect.source);
    const match = pathname.match(regex);
    if (!match) continue;

    let destination = redirect.destination;
    names.forEach((name, index) => {
      destination = destination.replaceAll(`:${name}`, match[index + 1] ?? '');
    });

    const isExternal = /^https?:\/\//i.test(destination);
    if (!isExternal && destination.replace(/\/+$/, '') === pathname.replace(/\/+$/, '')) continue;

    const location = !destination.includes('?') && search ? `${destination}${search}` : destination;
    return { location, status: redirect.permanent ? 301 : 302 };
  }
  return null;
}

// Redirect documents use dotted IDs (`redirect.project.*`), which Sanity treats as private: they are
// invisible to the public CDN client, so read them with the server-only token (uncached API).
function redirectsClient() {
  return createClient({
    projectId: sanityProjectId(),
    dataset: sanityDataset(),
    apiVersion: sanityApiVersion(),
    useCdn: false,
    perspective: 'published',
    token: sanityPreviewToken(),
  });
}

async function loadRedirects(): Promise<CmsRedirect[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.redirects;
  try {
    const redirects = (await redirectsClient().fetch<CmsRedirect[]>(REDIRECTS_QUERY)) ?? [];
    cache = { at: Date.now(), redirects };
    return redirects;
  } catch (error) {
    // Never break page loads because the CMS is unreachable: keep serving the last known list.
    console.error('Failed to load CMS redirects:', error);
    cache = { at: Date.now(), redirects: cache?.redirects ?? [] };
    return cache.redirects;
  }
}

/** Returns a redirect Response for document requests that match a CMS redirect, otherwise null. */
export async function cmsRedirectResponse(request: Request): Promise<Response | null> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  if (SKIPPED_PREFIXES.some(prefix => url.pathname.startsWith(prefix))) return null;
  // Static files (favicon.ico, sitemap.xml, images...) are never CMS redirects.
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null;

  const match = matchRedirect(url.pathname, url.search, await loadRedirects());
  if (!match) return null;
  return new Response(null, { status: match.status, headers: { Location: match.location } });
}
