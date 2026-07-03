const NSFW_TAG = 'NSFW';

/** Shop tags — covered by the dedicated “For sale” toggle, not the tag list. */
const SHOP_TAGS = new Set(['STORE', 'FOR SALE']);

type RefinementValue = { label: string; value?: unknown };
type CurrentRefinement = {
  attribute: string;
  refinements: RefinementValue[];
};

function normalizeTagLabel(label: string): string {
  return label.trim().toUpperCase();
}

function isNsfwTag(label: string): boolean {
  return normalizeTagLabel(label) === NSFW_TAG;
}

function isShopTag(label: string): boolean {
  return SHOP_TAGS.has(normalizeTagLabel(label));
}

function compareByCountThenName<T extends { label: string; count: number }>(a: T, b: T): number {
  if (b.count !== a.count) return b.count - a.count;
  return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
}

/** True when the user has actively refined the NSFW tag (or boolean isNSFW facet). */
export function isNsfwFacetActive(refinements: CurrentRefinement[]): boolean {
  return refinements.some(refinement => {
    if (refinement.attribute === 'tags') {
      return refinement.refinements.some(
        value => normalizeTagLabel(String(value.label)) === NSFW_TAG,
      );
    }
    if (refinement.attribute === 'isNSFW') {
      return refinement.refinements.some(value => value.value === true || value.value === 'true');
    }
    return false;
  });
}

/**
 * Tag facet list for the paintings sidebar:
 * 1. Active filters first (so selections stay visible)
 * 2. NSFW utility filter next among unselected tags
 * 3. Subject tags by popularity, then A–Z
 * Store / For sale are omitted — use the Shop toggle instead.
 */
export function tagFacetTransformItems<
  T extends { label: string; count: number; isRefined: boolean },
>(items: T[]): T[] {
  const filtered = items.filter(item => {
    if (isShopTag(item.label)) return false;
    return isNsfwTag(item.label) || item.count >= 3 || item.isRefined;
  });

  return [...filtered].sort((a, b) => {
    if (a.isRefined !== b.isRefined) return a.isRefined ? -1 : 1;

    if (a.isRefined && b.isRefined) {
      return compareByCountThenName(a, b);
    }

    const nsfwA = isNsfwTag(a.label);
    const nsfwB = isNsfwTag(b.label);
    if (nsfwA !== nsfwB) return nsfwA ? -1 : 1;

    return compareByCountThenName(a, b);
  });
}
