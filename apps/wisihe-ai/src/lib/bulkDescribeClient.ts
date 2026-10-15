import { readSanityAppProcessEnv } from '../sanityEnv';

export interface BulkDescribeInput {
  documentKind: 'painting' | 'project' | 'photography' | 'post';
  title: string;
  medium?: string;
  existingDescription?: string;
  imageUrl?: string;
}

export interface BulkDescribeResult {
  description: string;
  fieldType: 'text' | 'portableText';
  portableText?: Array<{
    _type: string;
    _key: string;
    style: string;
    markDefs: unknown[];
    children: Array<{ _type: string; _key: string; text: string; marks: string[] }>;
  }>;
}

const defaultProxy = 'http://localhost:1992';

export async function generateDescription(input: BulkDescribeInput): Promise<BulkDescribeResult> {
  const viteEnv =
    typeof import.meta !== 'undefined'
      ? (
          import.meta as {
            env?: { VITE_AI_PROXY_URL?: string; VITE_AI_PROXY_SECRET?: string; DEV?: boolean };
          }
        ).env
      : undefined;
  const base =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_URL') ??
    viteEnv?.VITE_AI_PROXY_URL?.trim() ??
    defaultProxy;
  const secret =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_SECRET') ??
    viteEnv?.VITE_AI_PROXY_SECRET?.trim() ??
    (viteEnv?.DEV ? 'wisihe-dev-local-secret' : '');

  if (!secret) {
    throw new Error(
      'Missing SANITY_APP_AI_PROXY_SECRET. Use the same value as SANITY_AI_PROXY_SECRET on the Next.js server.',
    );
  }

  const res = await fetch(`${base.replace(/\/$/, '')}/api/wisihe-ai/bulk-describe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      documentKind: input.documentKind,
      title: input.title,
      medium: input.medium ?? '',
      existingDescription: input.existingDescription ?? '',
      imageUrl: input.imageUrl ?? '',
    }),
  });

  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json as { error?: string };
    throw new Error(err?.error || `Bulk describe failed (${res.status})`);
  }
  return json as BulkDescribeResult;
}
