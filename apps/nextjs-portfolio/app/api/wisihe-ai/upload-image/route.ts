import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import {
  sanityAiProxyAllowedOrigins,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityWriteToken,
} from '@/lib/env';

export const runtime = 'nodejs';

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

  const token = sanityWriteToken() || process.env['SANITY_AUTH_TOKEN'];

  if (!token) {
    return NextResponse.json(
      { error: 'Server missing SANITY_API_WRITE_TOKEN' },
      { status: 500, headers },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers });
    }

    const client = createClient({
      projectId: sanityProjectId() || 'cbjsv7wi',
      dataset: sanityDataset() || 'production',
      apiVersion: sanityApiVersion() || '2025-02-19',
      token,
      useCdn: false,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const asset = await client.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type || undefined,
    });

    return NextResponse.json({ asset }, { headers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Image upload failed';
    return NextResponse.json({ error: message }, { status: 500, headers });
  }
}
