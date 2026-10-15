import { sanityAiProxyAllowedOrigins } from './env.server';

export function originAllowed(origin: string): boolean {
  const explicit = sanityAiProxyAllowedOrigins();
  if (explicit?.trim()) {
    return explicit
      .split(',')
      .map(s => s.trim())
      .some(entry => entry === '*' || entry === origin);
  }
  try {
    const host = new URL(origin).hostname;
    return host === 'localhost' || host.endsWith('.sanity.studio') || host.endsWith('.sanity.io');
  } catch {
    return false;
  }
}

export function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && originAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Vary', 'Origin');
  }
  return headers;
}
