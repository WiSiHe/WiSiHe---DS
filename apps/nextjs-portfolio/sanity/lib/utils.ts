import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/lib/api';

export declare const internalGroqTypeReferenceTo: unique symbol;

export type Link = {
  _type: 'link';
  linkType?: 'href' | 'page' | 'post' | 'painting' | 'slug';
  href?: string;
  page?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'page';
  };
  post?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'post';
  };
  slug?: string;
  painting?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'painting';
  };
  openInNewTab?: boolean;
};

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source: any) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto('format').fit('max');
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | undefined) {
  if (!link) return null;

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = 'href';
  }

  switch (link.linkType) {
    case 'href':
      return link.href || null;
    case 'slug':
      if (link?.slug) {
        return link.slug || null;
      }
      return null;

    case 'page':
      if (link?.page) {
        return `/${link.page}`;
      }
      return null;
    case 'post':
      if (link?.post) {
        return `/posts/${link.post}`;
      }
      return null;
    case 'painting':
      if (link?.painting) {
        return `/paintings/${link.painting}`;
      }
      return null;
    default:
      return null;
  }
}
