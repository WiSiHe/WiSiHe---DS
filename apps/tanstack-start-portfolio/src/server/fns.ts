import { createServerFn } from '@tanstack/react-start';
import {
  type AllPaintingsQueryResult,
  allPaintingsQuery,
  type GetAllProjectsResult,
  getAllProjects,
  type HomePageQueryResult,
  homePageQuery,
  type PaintingQueryResult,
  paintingQuery,
} from '@wisihe/sanity-queries';
import { portableTextToPlainText } from '../lib/portableText';
import { client, urlFor } from '../lib/sanity';

// Types for the frontend
export interface HomeData {
  title: string;
  overview: string;
  projectsDescription: string;
  featuredProjects: Array<{
    _id: string;
    title: string;
    description: string;
    imageUrl: string | null;
  }>;
}

export interface ProjectData {
  _id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tags: string[];
}

export interface PaintingData {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  date: string;
}

export interface PaintingDetailData {
  _id: string;
  title: string;
  description: string;
  paintedAt: string;
  images: Array<{
    url: string;
    lqip: string | null;
    aspectRatio: number;
  }>;
  tags: string[];
  video: string | null;
  redbubbleUrl: string | null;
  format: 'landscape' | 'portrait' | 'square';
  viewsCount: number;
}

export const getHomeData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<HomeData> => {
    const data = (await client.fetch(homePageQuery)) as HomePageQueryResult;

    return {
      title: data?.title || 'Building Digital Experiences with Precision',
      overview:
        portableTextToPlainText(data?.overview) ||
        "I'm a design engineer, painter and maker. Explore paintings, projects, and experiments from my portfolio.",
      projectsDescription:
        portableTextToPlainText(data?.projectsDescription) ||
        'A curated gallery of engineering and design projects built with modern web technologies.',
      featuredProjects: (data?.showcaseProjects || []).slice(0, 3).map(p => ({
        _id: p._id,
        title: p.name || p.title || '',
        description: (p.seo?.description ?? p.seoDescription ?? '').trim(),
        imageUrl: p.image ? urlFor(p.image).width(800).height(450).url() : null,
      })),
    };
  },
);

export const getProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ProjectData[]> => {
    const data = (await client.fetch(getAllProjects)) as GetAllProjectsResult;
    const allRaw = [...(data?.ongoingProjects || []), ...(data?.pastProjects || [])];

    return allRaw.map(p => ({
      _id: p._id,
      title: p.name || p.title || '',
      description: p.seoDescription?.trim() || '',
      imageUrl: p.image ? urlFor(p.image).width(800).height(450).url() : null,
      tags: p.tags?.map(t => t.name) || [],
    }));
  },
);

export const getPaintings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PaintingData[]> => {
    const data = (await client.fetch(allPaintingsQuery)) as AllPaintingsQueryResult;

    return data.map(p => ({
      _id: p._id,
      title: p.title,
      slug: p.slug.current,
      imageUrl: p.image ? urlFor(p.image).width(800).height(600).url() : null,
      date: p.date,
    }));
  },
);

export const getPainting = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<PaintingDetailData | null> => {
    const data = (await client.fetch(paintingQuery, { slug })) as PaintingQueryResult;

    if (!data) return null;

    const allRawImages = [data.image, ...(data.images || [])].filter(Boolean);

    return {
      _id: data._id,
      title: data.title,
      description: data.description || '',
      paintedAt: data.paintedAt || '',
      images: allRawImages.map(img => ({
        url: urlFor(img).width(1200).fit('max').url(),
        lqip: img.lqip || null,
        aspectRatio: img.aspectRatio || 1,
      })),
      tags: data.tagsV2?.map(t => t.name) || [],
      video: data.video || null,
      redbubbleUrl: data.redbubbleUrl || null,
      format: (data.format as 'landscape' | 'portrait' | 'square') || 'square',
      viewsCount: data.viewsCount || 0,
    };
  });
