type PaintingLike = Record<string, unknown> & {
  slug?: string | { current?: string } | null;
};

export function paintingSlug(painting: PaintingLike): string {
  const { slug } = painting;
  if (typeof slug === 'string') return slug;
  if (slug && typeof slug === 'object' && 'current' in slug) {
    return typeof slug.current === 'string' ? slug.current : '';
  }
  return '';
}
