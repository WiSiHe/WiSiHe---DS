import type { Rule } from 'sanity';

export const PROJECT_TAG_GUIDE =
  'Aim for 4–6 tags: 1–2 stack (e.g. NextJS, Sanity), 1 domain (Design, Game, E-commerce), and context when useful (Hackathon, Workshop). Reuse featured tags; skip generic labels like “Work”.';

export const PAINTING_TAG_GUIDE =
  'Aim for 3–5 tags: subject or theme, medium/style, and mood or technique when it helps discovery. Reuse existing tags instead of creating near-duplicates.';

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
