import { createClient } from '@sanity/client';
import { createFileRoute } from '@tanstack/react-router';
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityWriteToken,
} from '@/lib/env.server';
import { corsHeaders, originAllowed } from '@/lib/wisihe-ai-cors';

export const Route = createFileRoute('/api/wisihe-ai/upload-image')({
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

        const token = sanityWriteToken();
        if (!token) {
          return Response.json(
            { error: 'Server missing SANITY_API_WRITE_TOKEN' },
            { status: 500, headers },
          );
        }

        try {
          const formData = await request.formData();
          const file = formData.get('file') as File | null;

          if (!file) {
            return Response.json({ error: 'No file provided' }, { status: 400, headers });
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

          return Response.json({ asset }, { headers });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Image upload failed';
          return Response.json({ error: message }, { status: 500, headers });
        }
      },
    },
  },
});
