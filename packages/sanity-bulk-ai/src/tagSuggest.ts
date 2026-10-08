import type OpenAI from 'openai';

export type TagCatalogEntry = {
  id: string;
  name: string;
};

export type TagSuggestRequest = {
  documentKind: 'painting' | 'project' | 'photography' | 'post';
  title: string;
  textBody: string;
  tagsCatalog: TagCatalogEntry[];
  /** When set, vision is used alongside text (paintings). */
  imageUrl?: string | null;
  medium?: string | null;
  isFanArt?: boolean | null;
};

export type TagSuggestResult = {
  suggestedTagIds: string[];
};

function parseJsonObject(raw: string): Record<string, unknown> {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  const parsed: unknown = JSON.parse(s);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Response was not a JSON object');
  }
  return parsed as Record<string, unknown>;
}

function pickStringArray(obj: Record<string, unknown>, key: string): string[] {
  const v = obj[key];
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

/**
 * Ask OpenAI to pick existing tag document ids from a catalog (subset only).
 */
export async function runTagSuggest(
  openai: OpenAI,
  model: string,
  body: TagSuggestRequest,
): Promise<TagSuggestResult> {
  const allowed = new Set(body.tagsCatalog.map(t => t.id));
  const catalogLines = body.tagsCatalog.map(t => `- ${t.id}: ${t.name}`).join('\n');

  const typeRules =
    body.documentKind === 'painting'
      ? `
Painting rules:
- Pick 3–5 tag ids when possible (minimum 2 if only two clearly apply).
- 1–2 subject or theme; 1 medium/style when relevant; 1 mood or technique when helpful.
- Do NOT pick framework/stack tags unless the artwork is literally about that topic.
- Prefer tags already used on paintings in this portfolio when they fit.`
      : body.documentKind === 'photography'
        ? `
Photography rules:
- Pick 2–4 tag ids (landscape, travel, architecture, mood, lighting, location).
- Do NOT pick programming or code tags.`
        : body.documentKind === 'post'
          ? `
Blog post rules:
- Pick 2–5 tag ids reflecting key themes, technical subjects, and topics.`
          : `
Project rules:
- Prefer 4–6 tags when possible: stack, domain, and context when useful.
- Reuse featured tags; skip generic labels like "Work".`;

  const contextLines = [
    `Document type: ${body.documentKind}`,
    `Title: ${body.title}`,
    body.medium ? `Medium: ${body.medium}` : null,
    body.isFanArt === true ? 'Fan art: yes' : body.isFanArt === false ? 'Fan art: no' : null,
    `Text (may be truncated):\n${body.textBody.slice(0, 12_000)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const instructions = `You help categorize art portfolio content.

Return a single JSON object with key "suggestedTagIds": an array of string ids.
Rules:
- ONLY include ids that appear in the catalog below (exact id match).
- Omit tags that are unrelated.
- If nothing fits, return an empty array.
${typeRules}

${contextLines}

Catalog (id: name):
${catalogLines || '(empty catalog)'}

Respond with JSON only.`;

  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
    { type: 'text', text: instructions },
  ];
  if (body.imageUrl?.trim()) {
    userContent.push({
      type: 'image_url',
      image_url: { url: body.imageUrl.trim(), detail: 'low' },
    });
  }

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: userContent }],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '';
  const parsed = parseJsonObject(raw);
  const suggested = pickStringArray(parsed, 'suggestedTagIds').filter(id => allowed.has(id));
  return { suggestedTagIds: suggested };
}
