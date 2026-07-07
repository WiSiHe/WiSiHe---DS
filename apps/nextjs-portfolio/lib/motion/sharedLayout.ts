/** Shared element id for list → detail hero morph (paintings & projects). */
export function contentImageLayoutId(slug: string): string {
  return `image-${slug}`;
}

export const sharedLayoutTransition = {
  layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
};

/** List + detail routes that use shared layout morphs. */
export const SHARED_LAYOUT_ROUTE = /^\/(paintings|projects)(\/|$)/;

/** Detail routes where template fade would fight shared layout morphs. */
export const SHARED_LAYOUT_DETAIL_ROUTE = /^\/(paintings|projects)\/[^/]+$/;

/** List index routes — template enter fade only. */
export const SHARED_LAYOUT_LIST_ROUTE = /^\/(paintings|projects)$/;
