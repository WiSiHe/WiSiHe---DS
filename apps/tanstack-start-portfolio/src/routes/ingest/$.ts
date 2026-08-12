import { createFileRoute } from '@tanstack/react-router';

function resolvePostHogHosts() {
  const host = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com';
  const assetsHost = host.replace('.i.posthog.com', '-assets.i.posthog.com');
  return { host, assetsHost };
}

async function proxyToPostHog(request: Request, targetBase: string, splat: string) {
  const incoming = new URL(request.url);
  const target = new URL(`${targetBase.replace(/\/$/, '')}/${splat}`);
  target.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(target, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const Route = createFileRoute('/ingest/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { host, assetsHost } = resolvePostHogHosts();
        const splat = params._splat ?? '';
        const base = splat.startsWith('static/') ? assetsHost : host;
        return proxyToPostHog(request, base, splat);
      },
      POST: async ({ request, params }) => {
        const { host } = resolvePostHogHosts();
        return proxyToPostHog(request, host, params._splat ?? '');
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }),
    },
  },
});
