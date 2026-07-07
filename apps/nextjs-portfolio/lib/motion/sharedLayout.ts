/** Shared element id for list → detail hero morph (paintings, projects, videos, photography). */
export function contentImageLayoutId(key: string): string {
  return `image-${key}`;
}

/** Stable content slug — grid and detail must use the same key. */
export function contentSlugLayoutId(slug: string): string {
  const key = (slug ?? '').trim();
  return key ? contentImageLayoutId(key) : '';
}

/** @deprecated Prefer contentSlugLayoutId */
export function paintingSlugLayoutId(slug: string): string {
  return contentSlugLayoutId(slug);
}

/** @deprecated Prefer paintingSlugLayoutId — titles can differ between Algolia and Sanity. */
export function paintingImageLayoutId(title: string): string {
  return contentImageLayoutId((title ?? '').trim() || 'Untitled painting');
}

export const sharedLayoutTransition = {
  layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
};

/** Detail routes where template fade would fight shared layout morphs. */
export const SHARED_LAYOUT_DETAIL_ROUTE = /^\/(paintings|projects|videos|photography)\/[^/]+$/;
