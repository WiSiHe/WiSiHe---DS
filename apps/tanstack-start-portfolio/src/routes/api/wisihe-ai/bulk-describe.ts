import { createFileRoute } from '@tanstack/react-router';
import OpenAI from 'openai';
import { openaiApiKey, sanityAiProxySecret } from '@/lib/env.server';
import { corsHeaders, originAllowed } from '@/lib/wisihe-ai-cors';

export const Route = createFileRoute('/api/wisihe-ai/bulk-describe')({
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

        const envModel =
          typeof process !== 'undefined' ? process.env?.['OPENAI_COPILOT_MODEL'] : undefined;
        const MODEL = envModel || 'gpt-5.6-sol';

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
        const title = typeof o['title'] === 'string' ? o['title'].trim() : '';
        const medium = typeof o['medium'] === 'string' ? o['medium'].trim() : '';
        const existingDescription =
          typeof o['existingDescription'] === 'string' ? o['existingDescription'].trim() : '';
        const imageUrl = typeof o['imageUrl'] === 'string' ? o['imageUrl'].trim() : '';

        if (!documentKind || !title) {
          return Response.json(
            { error: 'Missing documentKind or title' },
            { status: 400, headers },
          );
        }

        let systemPrompt = '';
        let userMessage = '';

        if (documentKind === 'painting') {
          systemPrompt =
            'You write museum wall labels for an art portfolio. Guidelines:\n- 1–2 sentences, 40–240 characters total\n- Third person only (never "I", "my", "we", "me")\n- Do not repeat or quote the artwork title\n- Describe the visual subject, composition, colour or light, and mood\n- Tone: precise, thoughtful, calm curator voice\n- Present tense; no exclamation marks';
          userMessage = `Artwork Title: "${title}"${medium ? `\nMedium: ${medium}` : ''}${imageUrl ? '\n(Visual artwork image provided above for your direct observation)' : ''}${existingDescription ? `\nExisting label (do not copy, write a better one based on the image): ${existingDescription}` : ''}`;
        } else if (documentKind === 'project') {
          systemPrompt =
            'You are a professional technical writer for Henrik Wilhelm Sissener, a Norwegian developer and technical director. Write concise summaries for his projects shown in a portfolio sidebar. Guidelines: 2-3 sentences maximum, about 400 characters total. Plain text only. Tone: professional, clear, outcome-focused. Do NOT start with "This project" or repeat the title verbatim at the start.';
          userMessage = `Project: "${title}"${existingDescription ? `\nExisting summary (do not copy, rewrite better): ${existingDescription}` : ''}`;
        } else if (documentKind === 'photography') {
          systemPrompt =
            'You write gallery captions for travel and landscape photography. Guidelines:\n- 1–2 sentences, 40–280 characters\n- Third person; present tense\n- Describe the scene, light, and atmosphere observed in the photo—not equipment or "capturing the moment" clichés\n- Do not repeat the title\n- Plain text only';
          userMessage = `Photo Title: "${title}"${imageUrl ? '\n(Photograph image provided above for your direct observation)' : ''}${existingDescription ? `\nExisting caption: ${existingDescription}` : ''}`;
        } else if (documentKind === 'post') {
          systemPrompt =
            'You are an editorial assistant for Henrik Wilhelm Sissener\'s blog. Write engaging, clear excerpts that summarize the article topic in 1-2 sentences (~200 characters). Plain text only. Do NOT start with "In this post" or repeat the title verbatim.';
          userMessage = `Article Title: "${title}"${existingDescription ? `\nExisting excerpt: ${existingDescription}` : ''}`;
        }

        try {
          const openai = new OpenAI({ apiKey: OPENAI_KEY });
          const isNewModel =
            MODEL.startsWith('gpt-5') || MODEL.startsWith('gpt-6') || MODEL.startsWith('o');

          const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [];
          if (imageUrl) {
            userContent.push({
              type: 'image_url',
              image_url: { url: imageUrl, detail: 'low' },
            });
          }
          userContent.push({
            type: 'text',
            text: userMessage,
          });

          const completion = await openai.chat.completions.create({
            model: MODEL,
            ...(isNewModel ? {} : { temperature: 0.72 }),
            max_completion_tokens: 256,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userContent },
            ],
          });

          const text = (completion.choices[0]?.message?.content ?? '').trim();

          if (documentKind === 'project') {
            const portableText = text
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para, i) => ({
                _type: 'block',
                _key: `gen${i}`,
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: `s${i}`, text: para.trim(), marks: [] }],
              }));
            return Response.json(
              { description: text, portableText, fieldType: 'portableText' },
              { headers },
            );
          }
          return Response.json({ description: text, fieldType: 'text' }, { headers });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Description generation failed';
          return Response.json({ error: message }, { status: 500, headers });
        }
      },
    },
  },
});
