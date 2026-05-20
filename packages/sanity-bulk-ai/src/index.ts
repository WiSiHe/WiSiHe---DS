import type OpenAI from 'openai';

export * from './tagSuggest';

export const BULK_AI_MODEL = 'o4-mini-2025-04-16';

export type PaintingBulkRequest = {
  kind: 'painting';
  title: string;
  tags: string;
  imageUrl: string;
};

export type ProjectBulkRequest = {
  kind: 'project';
  name: string;
  tags: string;
  projectType: string;
  projectStatus: string;
  body: string;
  imageUrl: string | null;
};

export type BulkRequest = PaintingBulkRequest | ProjectBulkRequest;

export type PaintingBulkFields = {
  primaryAlt: string;
  longDescription: string;
  metaDescription: string;
  legacySeo: string;
};

export type ProjectBulkFields = {
  excerpt: string;
  metaDescription: string;
  imageAlt: string;
};

function clampChars(value: string, max: number): string {
  const t = value.trim();
  if (t.length <= max) return t;
  return t.slice(0, max);
}

function parseJsonObject(raw: string): Record<string, unknown> {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const parsed: unknown = JSON.parse(s);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Response was not a JSON object');
  }
  return parsed as Record<string, unknown>;
}

function pickString(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  return typeof v === 'string' ? v : '';
}

export async function runBulkAi(
  openai: OpenAI,
  body: BulkRequest,
): Promise<PaintingBulkFields | ProjectBulkFields> {
  if (body.kind === 'painting') {
    const instructions = `Return a single JSON object with exactly these string keys:
- "primaryAlt": concise image alt text for accessibility and SEO (max 92 characters).
- "longDescription": vivid long-form description (about 150–300 words), present tense, objective, flowing paragraphs about visual elements and artistic choices.
- "metaDescription": Google meta description (max 160 characters), compelling, no surrounding quotes.

Context:
Title: ${body.title}
Tags: ${body.tags || '(none)'}

Analyze the attached artwork image. Respond with JSON only.`;

    const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
      { type: 'text', text: instructions },
      { type: 'image_url', image_url: { url: body.imageUrl } },
    ];

    const completion = await openai.chat.completions.create({
      model: BULK_AI_MODEL,
      messages: [{ role: 'user', content: userContent }],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const parsed = parseJsonObject(raw);
    const primaryAlt = clampChars(pickString(parsed, 'primaryAlt'), 92);
    const longDescription = pickString(parsed, 'longDescription').trim();
    const metaDescription = clampChars(pickString(parsed, 'metaDescription'), 160);
    const legacySeo = clampChars(metaDescription, 122);

    return { primaryAlt, longDescription, metaDescription, legacySeo };
  }

  const bodySnippet = body.body
    ? body.body.slice(0, 8000)
    : '(No body text yet — infer from name, type, status, and tags.)';

  const instructions = `Return a single JSON object with exactly these string keys:
- "excerpt": short card/preview summary (max 280 characters), 1–2 sentences.
- "metaDescription": Google meta description (max 160 characters).
- "imageAlt": if an image is attached, concise alt text (max 92 characters). If there is effectively no image to describe, use an empty string.

Context:
Name: ${body.name}
Type: ${body.projectType || '(unknown)'}
Status: ${body.projectStatus || '(unknown)'}
Tags: ${body.tags || '(none)'}
Body text (may be truncated):
${bodySnippet}

Respond with JSON only.`;

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: 'text', text: instructions },
  ];
  if (body.imageUrl) {
    userContent.push({
      type: 'image_url',
      image_url: { url: body.imageUrl },
    });
  }

  const completion = await openai.chat.completions.create({
    model: BULK_AI_MODEL,
    messages: [{ role: 'user', content: userContent }],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '';
  const parsed = parseJsonObject(raw);
  const excerpt = clampChars(pickString(parsed, 'excerpt'), 280);
  const metaDescription = clampChars(pickString(parsed, 'metaDescription'), 160);
  const imageAlt = clampChars(pickString(parsed, 'imageAlt'), 92);

  return { excerpt, metaDescription, imageAlt };
}
