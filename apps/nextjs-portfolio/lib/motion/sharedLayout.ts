/** Shared element id for list → detail hero morph (paintings & projects). */
export function contentImageLayoutId(title: string): string {
  return `image-${title}`;
}

export const sharedLayoutTransition = {
  layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
};

/** Detail routes where template fade would fight shared layout morphs. */
export const SHARED_LAYOUT_DETAIL_ROUTE = /^\/(paintings|projects)\/[^/]+$/;
