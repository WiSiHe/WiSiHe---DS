import { runTagSuggest, type TagSuggestRequest } from '@wisihe/sanity-bulk-ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  openaiApiKey,
  openaiTagSuggestModel,
  sanityAiProxyAllowedOrigins,
  sanityAiProxySecret,
} from '@/lib/env';

export const runtime = 'nodejs';

const SECRET =
  sanityAiProxySecret() || (process.env.NODE_ENV !== 'production' ? 'wisihe-dev-local-secret' : '');
const OPENAI_KEY = openaiApiKey();
const TAG_MODEL = openaiTagSuggestModel();

function originAllowed(origin: string): boolean {
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

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && originAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Vary', 'Origin');
  }
  return headers;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);
  if (origin && !originAllowed(origin)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403, headers });
  }

  if (!SECRET || req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  if (!OPENAI_KEY) {
    return NextResponse.json({ error: 'Server missing OPENAI_API_KEY' }, { status: 503, headers });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers });
  }

  const o = body as Record<string, unknown>;
  const dk = o['documentKind'];
  const documentKind =
    dk === 'painting' || dk === 'project' || dk === 'photography' || dk === 'post' ? dk : null;
  const title = typeof o['title'] === 'string' ? o['title'] : '';
  const textBody = typeof o['textBody'] === 'string' ? o['textBody'] : '';
  const rawCatalog = o['tagsCatalog'];
  if (!documentKind || !title.trim()) {
    return NextResponse.json({ error: 'Missing documentKind or title' }, { status: 400, headers });
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

  try {
    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    const result = await runTagSuggest(openai, TAG_MODEL, {
      documentKind,
      title,
      textBody,
      tagsCatalog,
    });
    return NextResponse.json(result, { headers });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Tag suggest failed';
    return NextResponse.json({ error: message }, { status: 500, headers });
  }
}
