const METADATA_BLOCK = `
Known location context (GPS is factual when present; treat editor fields as hints):
{fileMetadata}`;

export const TRAVEL_PLACE_FUN_FACT_PROMPT = `You write one short, objective fun fact about a real place for a travel map on a portfolio site.

Requirements:
- One sentence, 40–120 characters
- Verifiable and factual — history, geography, culture, architecture, or a specific local detail
- Third person only; never use first person (no "I", "we", "my", "our")
- No invented anecdotes, no pretending the author visited, no emotional travel diary tone
- Surprising or specific — not generic brochure copy ("beautiful city", "rich history")
- No emojis, no quotes, no "Did you know"
- If uncertain, state a well-known fact about the named place; do not guess obscure details
- Return only the fun fact${METADATA_BLOCK}`;

export const TRAVEL_PLACE_NOTES_PROMPT = `You write short, objective context about a real place for a map detail card on a portfolio site.

Requirements:
- 1–2 sentences, 80–280 characters
- Factual and encyclopedic in tone — geography, history, what the place is known for
- Third person only; never use first person (no "I", "we", "my", "our")
- No personal memories, feelings, or "when I visited" framing
- Complement the fun fact; do not repeat it verbatim
- Only include claims you are confident are true for the named place and country
- Return only the notes text${METADATA_BLOCK}`;
