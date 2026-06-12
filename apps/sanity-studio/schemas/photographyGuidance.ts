/** Vision prompts for photography — keep in sync if bulk scripts are added later. */

const METADATA_BLOCK = `
Known metadata (from EXIF/GPS and editor fields — treat GPS and capture date as factual when present):
{fileMetadata}`;

export const PHOTOGRAPHY_ALT_AI_PROMPT = `You are an accessibility and SEO expert. Write concise alt text for this travel photograph in 96 characters or less. Describe the subject, setting, and mood. No "image of" or "photo of". Return only the alt text.${METADATA_BLOCK}`;

export const PHOTOGRAPHY_TITLE_AI_PROMPT = `You write short titles for a travel and landscape photography portfolio.

Requirements:
- One evocative title, 3–80 characters
- No quotes, no emojis, no "Untitled"
- Capture place, light, or mood—not camera jargon
- Return only the title${METADATA_BLOCK}`;

export const PHOTOGRAPHY_CAPTION_AI_PROMPT = `You write gallery captions for travel and landscape photography.

Requirements:
- 1–2 sentences, 40–280 characters
- Third person; present tense
- Describe scene, light, and atmosphere—not equipment or "capturing the moment" clichés
- Do not repeat the title
- Return only the caption${METADATA_BLOCK}`;

export const PHOTOGRAPHY_PLACE_AI_PROMPT = `Identify the most likely specific place where this photograph was taken (city, landmark, beach, mountain, etc.). If GPS coordinates are in the metadata, use them to infer the nearest place name. If you cannot determine, respond with exactly: Unknown. Return only the place name, no punctuation or extra words.${METADATA_BLOCK}`;

export const PHOTOGRAPHY_COUNTRY_AI_PROMPT =
  'Identify the country where this photograph was most likely taken. Return only the English country name (e.g. Norway, Japan). If uncertain, respond with exactly: Unknown.';

export const PHOTOGRAPHY_REGION_AI_PROMPT = `If identifiable, return the region, state, province, or county in English. Use GPS or country metadata when helpful. If uncertain, respond with exactly: Unknown. Return only the region name.${METADATA_BLOCK}`;
