import type { Rule } from 'sanity';

export const PROJECT_TAG_GUIDE =
  'Aim for 4–6 tags: 1–2 stack (e.g. NextJS, Sanity), 1 domain (Design, Game, E-commerce), and context when useful (Hackathon, Workshop). Reuse featured tags; skip generic labels like “Work”.';

export const PAINTING_TAG_GUIDE =
  'Aim for 3–5 tags: subject or theme, medium/style, and mood or technique when it helps discovery. Reuse existing tags instead of creating near-duplicates.';

/** Editor-only tag note — keep in sync with scripts/bulk-update-tags.mjs */
export const TAG_DESCRIPTION_AI_PROMPT = `Write a short editor note for a portfolio tag (under 150 characters).
Explain what paintings, projects, or recipes belong under this tag.
Third person, factual tone — not marketing copy.
Do NOT use phrases like "Explore my", "Discover my art", or "Discover more today".
Return only the description text.`;

/** Painting tag pick rules for AI — keep in sync with packages/sanity-bulk-ai/src/tagSuggest.ts */
export const PAINTING_TAG_AI_RULES = `Pick 3–5 tag ids from the catalog:
- 1–2 subject or theme (figure, landscape, fan-art subject, etc.)
- 1 medium or style when relevant (e.g. Digital Art, Watercolor)
- 1 mood or technique when it helps discovery
Reuse existing tags only. Do NOT pick framework/stack tags (NextJS, Sanity, React, etc.) unless the artwork is literally about that topic.
Do NOT pick generic project tags (Design System, Hackathon, Workshop) unless clearly relevant.`;

/** Shared validation: required, soft minimum for discovery, warn when the list gets too long. */
export function validateContentTags(rule: Rule, minRecommended = 2) {
  return rule
    .required()
    .min(minRecommended)
    .warning(`Add at least ${minRecommended} tags so filters and search stay useful.`)
    .max(8)
    .warning(
      'More than 8 tags makes filters harder to use — consolidate or remove redundant tags.',
    );
}
