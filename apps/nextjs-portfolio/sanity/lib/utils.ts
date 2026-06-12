import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/lib/api';
import { client } from './client';

export declare const internalGroqTypeReferenceTo: unique symbol;

export type Link = {
  _type: 'link';
  linkType?: 'href' | 'page' | 'post' | 'painting' | 'project' | 'recipe' | 'video' | 'slug';
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
  project?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'project';
  };
  recipe?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'recipe';
  };
  video?: {
    _ref: string;
    _type: 'reference';
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: 'video';
  };
  openInNewTab?: boolean;
};

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

interface SanityImageSource {
  asset?: {
    _ref: string;
    _type?: string;
    _weak?: boolean;
  };
}
export const urlForImage = (source: SanityImageSource | null | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto('format').fit('max');
};

/** Flatten Sanity portable text blocks into a plain string (e.g. meta descriptions). */
export function portableTextToPlainText(
  blocks: readonly Record<string, unknown>[] | null | undefined,
  maxLength?: number,
): string {
  if (!blocks?.length) return '';

  const text = blocks
    .map(block => {
      const children = block['children'] as Array<{ text?: string }> | undefined;
      if (!children?.length) return '';
      return children.map(child => child.text ?? '').join('');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';
  if (maxLength != null && text.length > maxLength) {
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
  }
  return text;
}

export function resolveOpenGraphImage(
  image: (SanityImageSource & { alt?: string }) | null | undefined,
  width = 1200,
  height = 627,
) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url();
  if (!url) return;
  return { url, alt: image?.alt || '', width, height };
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
      if (link?.page?._ref) {
        return `/${link.page._ref}`;
      }
      return null;
    case 'post':
      if (link?.post?._ref) {
        return `/posts/${link.post._ref}`;
      }
      return null;
    case 'painting':
      if (link?.painting?._ref) {
        return `/paintings/${link.painting._ref}`;
      }
      return null;
    case 'project':
      if (link?.project?._ref) {
        return `/projects/${link.project._ref}`;
      }
      return null;
    case 'recipe':
      if (link?.recipe?._ref) {
        return `/recipes/${link.recipe._ref}`;
      }
      return null;
    case 'video':
      if (link?.video?._ref) {
        return `/videos/${link.video._ref}`;
      }
      return null;
    default:
      return null;
  }
}

export async function patchPaintingViews(paintingId: string, viewerId: string): Promise<void> {
  try {
    // Apply the patch to the draft or published document
    const patch = await client
      .patch(paintingId)
      .setIfMissing({ views: [] })
      .insert('after', 'views[-1]', [
        {
          _key: crypto.randomUUID(), // Unique key
          viewerId,
          timestamp: new Date().toISOString(),
        },
      ])
      .commit({ autoGenerateArrayKeys: true }); // Ensure unique keys are generated

    console.log('Patch applied:', patch);

    // Retrieve the full document
    const updatedDoc = await client.getDocument(paintingId);

    if (updatedDoc) {
      // Publish the document by replacing the published version
      await client.createOrReplace({
        ...updatedDoc,
        _id: paintingId, // Ensure the ID doesn't include `drafts.`
      });

      console.log('Document published:', paintingId);
    }
  } catch (error) {
    console.error('Failed to patch and publish painting views:', error);
  }
}
