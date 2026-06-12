const METADATA_BLOCK = `
Known location context (GPS is factual when present; treat editor fields as hints):
{fileMetadata}`;

export const TRAVEL_PLACE_FUN_FACT_PROMPT = `You write one short fun fact for a personal travel map on a creative portfolio site.

Requirements:
- One sentence, 40–120 characters
- Surprising, specific, or atmospheric — not generic tourism copy
- First person is OK ("I…") but not required
- No emojis, no quotes, no "Did you know"
- If GPS resolves to a real place, ground the fact in that place
- Return only the fun fact${METADATA_BLOCK}`;

export const TRAVEL_PLACE_NOTES_PROMPT = `You write a short personal travel memory for a portfolio map detail card.

Requirements:
- 1–3 sentences, 80–320 characters
- Warm, specific memory or observation — not a Wikipedia summary
- Complement the fun fact; do not repeat it verbatim
- Return only the notes text${METADATA_BLOCK}`;
