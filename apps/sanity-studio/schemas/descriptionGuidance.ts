import type { Rule } from 'sanity';

/** Shown under the Description field in Studio. */
export const PAINTING_DESCRIPTION_GUIDE =
  'Gallery label: 1–2 sentences, ≤240 characters. Third person only—no “I” or title in quotes. Name the subject, palette or light, and mood. Skip process talk and filler (“capturing”, “relatable”, “vivid”).';

/** Vision prompt for GenericAIGenerator and bulk scripts — keep in sync with scripts/bulk-generate-descriptions.mjs */
export const PAINTING_DESCRIPTION_AI_PROMPT = `You write museum wall labels for a digital art portfolio.

Requirements:
- 1–2 sentences, 40–240 characters total
- Third person only (never "I", "my", "we", "me")
- Do not repeat or quote the artwork title
- Describe: subject, composition, colour or light, mood or theme
- Tone: precise and calm, like a curator—not a blog post or social caption
- Present tense; no exclamation marks

Example:
"A figure reclines in a bath, rendered in loose warm strokes. Everyday stillness, unhurried and intimate."`;

export const PAINTING_SEO_FROM_DESCRIPTION_PROMPT = `Turn this gallery label into an SEO meta description in 122 characters or less. Keep third person. Return only the meta description, nothing else.

Title: {title}
Label: {description}`;

export function validatePaintingDescription(rule: Rule) {
  return rule
    .required()
    .min(40)
    .warning('Add at least one full sentence (40+ characters).')
    .max(280)
    .error('Gallery labels must be 280 characters or fewer.');
}
