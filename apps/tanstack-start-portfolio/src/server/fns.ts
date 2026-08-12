// @ts-nocheck — Sanity CMS payloads include `unknown` media fields that fail
// TanStack Start's ValidateSerializable checks; runtime JSON is fine.
import { createServerFn } from '@tanstack/react-start';
import {
  type AboutQueryResult,
  type AllPresentationsQueryResult,
  aboutQuery,
  aboutTravelPhotographyQuery,
  allPresentationsQuery,
  type GetAllProjectsResult,
  type GetAllRecipesResult,
  type GetAllVideosResult,
  type GetPaginatedPaintingsResult,
  type GetRecipeResult,
  getAllProjects,
  getAllRecipes,
  getAllVideos,
  getPaginatedPaintings,
  getPaintingsCount,
  getRecipe,
  type HomeExtrasQueryResult,
  type HomePageQueryResult,
  homeExtrasQuery,
  homePageQuery,
  type IndexableContentSlugsResult,
  indexableContentSlugs,
  type PaintingQueryResult,
  type PhotographyListQueryResult,
  type PhotographyQueryResult,
  type PresentationQueryResult,
  type ProjectQueryResult,
  paintingQuery,
  photographyListQuery,
  photographyQuery,
  presentationQuery,
  projectQuery,
  type SettingsQueryResult,
  settingsQuery,
  type VideoBySlugQueryResult,
  videoBySlugQuery,
} from '@wisihe/sanity-queries';
import { z } from 'zod';
import { portableTextToPlainText } from '../lib/portableText';
import { getSanityClientForRequest, urlFor } from '../lib/sanity';
import { isPreviewEnabled } from '../lib/sanity/draftMode';

const slugInput = z.object({ slug: z.string().min(1) });

async function fetchSanity<T = any>(
  request: Request | undefined,
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const sanity = getSanityClientForRequest(request);
  return sanity.fetch(query, params) as Promise<T>;
}

function imageUrl(
  image: Parameters<typeof urlFor>[0] | null | undefined,
  width = 800,
  height?: number,
): string | null {
  if (!image) return null;
  let builder = urlFor(image).width(width).auto('format').quality(85);
  if (height) builder = builder.height(height);
  return builder.url();
}

export type PaintingListItem = GetPaginatedPaintingsResult[number];

export interface PaintingDetailImage {
  url: string;
  thumbUrl: string;
  lqip: string | null;
  aspectRatio: number;
  width: number | null;
  height: number | null;
  hasAlpha: boolean;
  palette: Record<string, unknown> | null;
  assetRef: string | null;
}

export interface PaintingDetailData {
  _id: string;
  slug: string;
  title: string;
  description: string;
  paintedAt: string;
  images: PaintingDetailImage[];
  tags: string[];
  tagsV2: Array<{ name: string | null }>;
  video: string | null;
  redbubbleUrl: string | null;
  gelatoUrl: string | null;
  format: 'landscape' | 'portrait' | 'square';
  viewsCount: number;
  likesCount: number;
  isNSFW: boolean;
  isFanArt: boolean;
  relatedPaintings: Array<{
    _id: string;
    slug: string;
    title: string;
    imageUrl: string | null;
    lqip: string | null;
  }>;
}

export const getHomeData = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  const [home, about, extras] = await Promise.all([
    fetchSanity(request, homePageQuery),
    fetchSanity(request, aboutQuery),
    fetchSanity(request, homeExtrasQuery),
  ]);

  return {
    home: home as HomePageQueryResult,
    about: about as AboutQueryResult | null,
    extras: extras as HomeExtrasQueryResult | null,
  };
});

export const getProjects = createServerFn({ method: 'GET' }).handler(
  async ({ request }): Promise<GetAllProjectsResult> => {
    return fetchSanity(request, getAllProjects);
  },
);

export const getProject = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    return fetchSanity(request, projectQuery, { slug: data.slug });
  });

export const getPaintings = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  const count = ((await fetchSanity<number>(request, getPaintingsCount)) as number) || 0;
  const end = count > 0 ? count : 500;

  return fetchSanity<GetPaginatedPaintingsResult>(request, getPaginatedPaintings, {
    start: 0,
    end,
  });
});

export const getPainting = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    const painting = (await fetchSanity(request, paintingQuery, {
      slug: data.slug,
    })) as any;

    if (!painting) return null;

    const allRawImages = [painting.image, ...(painting.images || [])].filter(Boolean);
    const seenRefs = new Set<string>();
    const dedupedImages = allRawImages.filter((img: any) => {
      const ref = img?.asset?._ref;
      if (!ref || seenRefs.has(ref)) return false;
      seenRefs.add(ref);
      return true;
    });

    const mapImage = (img: any): PaintingDetailImage => {
      const width = img?.width ?? null;
      const height = img?.height ?? null;
      const builder = urlFor(img);
      return {
        url: builder.width(1600).fit('max').auto('format').quality(90).url(),
        thumbUrl: builder.width(128).height(128).fit('crop').format('webp').quality(70).url(),
        lqip: img?.lqip || null,
        aspectRatio: img?.aspectRatio || 1,
        width,
        height,
        hasAlpha: img?.hasAlpha ?? false,
        palette: img?.palette ?? null,
        assetRef: img?.asset?._ref ?? null,
      };
    };

    const tagNames = painting.tagsV2?.map((t: any) => t?.name).filter(Boolean) ?? [];

    let relatedPaintings: PaintingDetailData['relatedPaintings'] = [];
    if (tagNames.length > 0) {
      relatedPaintings = ((await fetchSanity(
        request,
        `*[_type == "painting" && slug.current != $slug && isNSFW != true && count((tagsV2[]->name)[@ in $tagNames]) > 0]
          | order(paintedAt desc) [0...4] {
            _id,
            title,
            "slug": slug.current,
            image {
              ...,
              "lqip": asset->metadata.lqip
            }
          }`,
        { slug: data.slug, tagNames },
      )) ?? []) as any[];

      relatedPaintings = relatedPaintings
        .filter((p: any) => p?.slug)
        .map((p: any) => ({
          _id: p._id,
          slug: p.slug,
          title: p.title ?? 'Painting',
          imageUrl: p.image ? urlFor(p.image).width(600).fit('max').url() : null,
          lqip: p.image?.lqip ?? null,
        }));
    }

    return {
      _id: painting._id,
      slug: painting.slug ?? data.slug,
      title: painting.title,
      description: painting.description || '',
      paintedAt: painting.paintedAt || '',
      images: dedupedImages.map(mapImage),
      tags: tagNames,
      tagsV2: painting.tagsV2 ?? [],
      video: painting.video || null,
      redbubbleUrl: painting.redbubbleUrl || null,
      gelatoUrl: painting.gelatoUrl || null,
      format: (painting.format as 'landscape' | 'portrait' | 'square') || 'square',
      viewsCount: painting.viewsCount || 0,
      likesCount: painting.likesCount || 0,
      isNSFW: painting.isNSFW === true,
      isFanArt: painting.isFanArt === true,
      relatedPaintings,
    } satisfies PaintingDetailData;
  });

export const getFooterData = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  const [settings, about] = await Promise.all([
    fetchSanity(request, settingsQuery),
    fetchSanity(request, aboutQuery),
  ]);

  return {
    socialLinks: (about as any)?.socialLinks ?? (settings as any)?.socialLinks ?? null,
    jobTitle: (about as any)?.jobTitle ?? null,
    heroSubtitle: (about as any)?.heroSubtitle ?? null,
    ctaLabel: (about as any)?.ctaButtonText ?? null,
    ctaHref: (about as any)?.ctaButtonUrl ?? null,
    previewEnabled: isPreviewEnabled(request),
  };
});

export const getVideos = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return fetchSanity(request, getAllVideos);
});

export const getVideo = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    return fetchSanity(request, videoBySlugQuery, {
      slug: data.slug,
    });
  });

export const getPhotographyList = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return ((await fetchSanity(request, photographyListQuery)) ?? []) as any;
});

export const getPhotography = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    return fetchSanity(request, photographyQuery, {
      slug: data.slug,
    });
  });

export const getRecipes = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return ((await fetchSanity(request, getAllRecipes)) ?? []) as any;
});

export const getRecipeBySlug = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    return fetchSanity(request, getRecipe, { slug: data.slug });
  });

export const getPresentations = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return ((await fetchSanity(request, allPresentationsQuery)) ?? []) as any;
});

export const getPresentation = createServerFn({ method: 'GET' })
  .validator(slugInput)
  .handler(async ({ data, request }) => {
    return fetchSanity(request, presentationQuery, {
      slug: data.slug,
    });
  });

export const getAbout = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return fetchSanity(request, aboutQuery);
});

export const getAboutTravelPhotography = createServerFn({ method: 'GET' }).handler(
  async ({ request }) => {
    return ((await fetchSanity(request, aboutTravelPhotographyQuery)) ?? []) as any;
  },
);

export const getSettings = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return fetchSanity(request, settingsQuery);
});

export const getSitemapEntries = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return ((await fetchSanity(request, indexableContentSlugs)) ?? []) as any;
});

export const getPreviewStatus = createServerFn({ method: 'GET' }).handler(async ({ request }) => ({
  enabled: isPreviewEnabled(request),
}));

export { imageUrl };
