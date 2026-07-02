import { readSanityAppProcessEnv } from '../sanityEnv';

export type TagCatalogEntry = {
  id: string;
  name: string;
};

export type TagSuggestResult = {
  suggestedTagIds: string[];
};

const defaultProxy = 'http://localhost:1992';

export async function suggestTagsFromProxy(input: {
  documentKind: 'painting' | 'project';
  title: string;
  textBody: string;
  tagsCatalog: TagCatalogEntry[];
}): Promise<TagSuggestResult> {
  const base =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_URL') ??
    import.meta.env.VITE_AI_PROXY_URL?.trim() ??
    defaultProxy;
  const secret =
    readSanityAppProcessEnv('SANITY_APP_AI_PROXY_SECRET') ??
    import.meta.env.VITE_AI_PROXY_SECRET?.trim();
  if (!secret) {
    throw new Error(
      'Missing SANITY_APP_AI_PROXY_SECRET (or legacy VITE_AI_PROXY_SECRET). Use the same value as SANITY_AI_PROXY_SECRET on the Next.js server.',
    );
  }

  const res = await fetch(`${base.replace(/\/$/, '')}/api/wisihe-ai/suggest-tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      documentKind: input.documentKind,
      title: input.title,
      textBody: input.textBody,
      tagsCatalog: input.tagsCatalog.map(t => ({ id: t.id, name: t.name })),
    }),
  });

  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json as { error?: string };
    throw new Error(err?.error || `Tag suggest failed (${res.status})`);
  }
  return json as TagSuggestResult;
}
