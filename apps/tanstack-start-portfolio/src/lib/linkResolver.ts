export type Link = {
  _type?: 'link';
  linkType?: 'href' | 'page' | 'post' | 'painting' | 'project' | 'recipe' | 'video' | 'slug';
  href?: string;
  page?: { _ref: string; _type?: 'reference' };
  post?: { _ref: string; _type?: 'reference' };
  slug?: string;
  painting?: { _ref: string; _type?: 'reference' };
  project?: { _ref: string; _type?: 'reference' };
  recipe?: { _ref: string; _type?: 'reference' };
  video?: { _ref: string; _type?: 'reference' };
  openInNewTab?: boolean;
};

export function linkResolver(link: Link | undefined | null): string | null {
  if (!link) return null;

  const resolved = { ...link };
  if (!resolved.linkType && resolved.href) {
    resolved.linkType = 'href';
  }

  switch (resolved.linkType) {
    case 'href':
      return resolved.href || null;
    case 'slug':
      return resolved.slug || null;
    case 'page':
      return resolved.page?._ref ? `/${resolved.page._ref}` : null;
    case 'post':
      return resolved.post?._ref ? `/posts/${resolved.post._ref}` : null;
    case 'painting':
      return resolved.painting?._ref ? `/paintings/${resolved.painting._ref}` : null;
    case 'project':
      return resolved.project?._ref ? `/projects/${resolved.project._ref}` : null;
    case 'recipe':
      return resolved.recipe?._ref ? `/recipes/${resolved.recipe._ref}` : null;
    case 'video':
      return resolved.video?._ref ? `/videos/${resolved.video._ref}` : null;
    default:
      return null;
  }
}
