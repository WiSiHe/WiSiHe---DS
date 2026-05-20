import type OpenAI from 'openai';

export type TagCatalogEntry = {
  id: string;
  name: string;
};

export type TagSuggestRequest = {
  documentKind: 'painting' | 'project';
  title: string;
  textBody: string;
  tagsCatalog: TagCatalogEntry[];
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

  const instructions = `You help categorize art portfolio content.

Return a single JSON object with key "suggestedTagIds": an array of string ids.
Rules:
- ONLY include ids that appear in the catalog below (exact id match).
- Prefer 3–10 tags when possible; fewer is fine if only a few clearly apply.
- Omit tags that are unrelated.
- If nothing fits, return an empty array.

Document type: ${body.documentKind}
Title: ${body.title}
Text (may be truncated):
${body.textBody.slice(0, 12_000)}

Catalog (id: name):
${catalogLines || '(empty catalog)'}

Respond with JSON only.`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: instructions }],
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '';
  const parsed = parseJsonObject(raw);
  const suggested = pickStringArray(parsed, 'suggestedTagIds').filter(id => allowed.has(id));
  return { suggestedTagIds: suggested };
}
