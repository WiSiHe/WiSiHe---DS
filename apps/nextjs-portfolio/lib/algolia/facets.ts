const NSFW_TAG = 'NSFW';
const STORE_TAGS = new Set(['STORE', 'FOR SALE']);

type RefinementValue = { label: string; value?: unknown };
type CurrentRefinement = {
  attribute: string;
  refinements: RefinementValue[];
};

function normalizeTagLabel(label: string): string {
  return label.trim().toUpperCase();
}

function isPinnedTag(label: string): boolean {
  const normalized = normalizeTagLabel(label);
  return STORE_TAGS.has(normalized) || normalized === NSFW_TAG;
}

/** Lower = higher in the facet list. */
function pinnedTagSortOrder(label: string): number {
  const normalized = normalizeTagLabel(label);
  if (STORE_TAGS.has(normalized)) return 0;
  if (normalized === NSFW_TAG) return 1;
  return 100;
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
 * Surface Store + NSFW facets even when counts are low; pin them to the top of the list.
 */
export function tagFacetTransformItems<
  T extends { label: string; count: number; isRefined: boolean },
>(items: T[]): T[] {
  const filtered = items.filter(
    item => isPinnedTag(item.label) || item.count >= 3 || item.isRefined,
  );

  return [...filtered].sort((a, b) => {
    const orderA = pinnedTagSortOrder(a.label);
    const orderB = pinnedTagSortOrder(b.label);
    if (orderA !== orderB) return orderA - orderB;
    if (a.isRefined !== b.isRefined) return a.isRefined ? -1 : 1;
    return b.count - a.count;
  });
}
