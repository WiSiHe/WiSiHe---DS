import { createFileRoute } from '@tanstack/react-router';
import { runTagSuggest, type TagSuggestRequest } from '@wisihe/sanity-bulk-ai';
import OpenAI from 'openai';
import { openaiApiKey, openaiTagSuggestModel, sanityAiProxySecret } from '@/lib/env.server';
import { corsHeaders, originAllowed } from '@/lib/wisihe-ai-cors';

export const Route = createFileRoute('/api/wisihe-ai/suggest-tags')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const origin = request.headers.get('origin');
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      },
      POST: async ({ request }) => {
        const origin = request.headers.get('origin');
        const headers = corsHeaders(origin);

        if (origin && !originAllowed(origin)) {
          return Response.json({ error: 'Forbidden origin' }, { status: 403, headers });
        }

        const SECRET =
          sanityAiProxySecret() || (import.meta.env.DEV ? 'wisihe-dev-local-secret' : '');
        if (!SECRET || request.headers.get('authorization') !== `Bearer ${SECRET}`) {
          return Response.json({ error: 'Unauthorized' }, { status: 401, headers });
        }

        const OPENAI_KEY = openaiApiKey();
        if (!OPENAI_KEY) {
          return Response.json(
            { error: 'Server missing OPENAI_API_KEY' },
            { status: 503, headers },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400, headers });
        }

        const o = body as Record<string, unknown>;
        const dk = o['documentKind'];
        const documentKind =
          dk === 'painting' || dk === 'project' || dk === 'photography' || dk === 'post'
            ? dk
            : null;
        const title = typeof o['title'] === 'string' ? o['title'] : '';
        const textBody = typeof o['textBody'] === 'string' ? o['textBody'] : '';
        const rawCatalog = o['tagsCatalog'];
        if (!documentKind || !title.trim()) {
          return Response.json(
            { error: 'Missing documentKind or title' },
            { status: 400, headers },
          );
        }

        const tagsCatalog: TagSuggestRequest['tagsCatalog'] = [];
        if (Array.isArray(rawCatalog)) {
          for (const row of rawCatalog) {
            if (!row || typeof row !== 'object') continue;
            const r = row as Record<string, unknown>;
            const id =
              typeof r['id'] === 'string' ? r['id'] : typeof r['_id'] === 'string' ? r['_id'] : '';
            const name = typeof r['name'] === 'string' ? r['name'] : '';
            if (id && name) tagsCatalog.push({ id, name });
          }
        }

        const TAG_MODEL = openaiTagSuggestModel();

        try {
          const openai = new OpenAI({ apiKey: OPENAI_KEY });
          const result = await runTagSuggest(openai, TAG_MODEL, {
            documentKind,
            title,
            textBody,
            tagsCatalog,
          });
          return Response.json(result, { headers });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Tag suggest failed';
          return Response.json({ error: message }, { status: 500, headers });
        }
      },
    },
  },
});
