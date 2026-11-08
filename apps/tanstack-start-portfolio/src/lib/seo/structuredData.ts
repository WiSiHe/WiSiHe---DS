import { SITE_URL } from '../site';
import {
  HOME_DESCRIPTION_FALLBACK,
  JSON_LD_KNOWS_ABOUT,
  JSON_LD_PERSON_DESCRIPTION,
} from '../siteCopy';
import { buildPersonReference } from './jsonLd';

export function buildRootStructuredDataGraph() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Henrik Sissener',
    jobTitle: 'Senior Frontend Developer & Digital Artist',
    description: JSON_LD_PERSON_DESCRIPTION,
    url: SITE_URL,
    sameAs: [
      'https://github.com/wisihe',
      'https://www.linkedin.com/in/henrik-sissener/',
      'https://twitter.com/wisihe',
      'https://www.instagram.com/wisihe/',
      'https://www.youtube.com/@wisihe',
    ],
    knowsAbout: [...JSON_LD_KNOWS_ABOUT],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'WiSiHe | Portfolio',
    description: HOME_DESCRIPTION_FALLBACK,
    url: SITE_URL,
    author: buildPersonReference(),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [person, website],
  };
}

function truncate(text: string, max = 300): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

export function buildPaintingStructuredData(input: {
  slug: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  paintedAt?: string | null;
  tags?: string[];
}) {
  const pageUrl = `${SITE_URL}/paintings/${input.slug}`;
  const description = truncate(input.description ?? '') || `Digital painting: ${input.title}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': pageUrl,
    name: input.title,
    description,
    ...(input.imageUrl ? { contentUrl: input.imageUrl } : {}),
    ...(input.paintedAt ? { dateCreated: input.paintedAt } : {}),
    creator: buildPersonReference(),
    license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    acquireLicensePage: `${SITE_URL}/contact`,
    copyrightNotice: 'Henrik Sissener',
    creditText: 'Henrik Sissener',
    ...(input.tags?.length ? { keywords: input.tags.join(', ') } : {}),
  };
}

const PROJECT_TYPE_SCHEMA: Record<string, string> = {
  development: 'WebApplication',
  gameDevelopment: 'VideoGame',
  design: 'CreativeWork',
  other: 'CreativeWork',
};

export function buildProjectStructuredData(input: {
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  projectType?: string | null;
  projectStart?: string | null;
  projectEnd?: string | null;
  tags?: string[];
}) {
  const projectUrl = `${SITE_URL}/projects/${input.slug}`;
  const schemaType = input.projectType
    ? (PROJECT_TYPE_SCHEMA[input.projectType] ?? 'CreativeWork')
    : 'CreativeWork';

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: input.name,
    description: input.description?.trim() || '',
    url: projectUrl,
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
    ...(input.projectStart ? { dateCreated: input.projectStart } : {}),
    ...(input.projectEnd ? { datePublished: input.projectEnd } : {}),
    author: buildPersonReference(),
    creator: buildPersonReference(),
    ...(input.tags?.length ? { keywords: input.tags.join(', ') } : {}),
  };
}

export function buildVideoStructuredData(input: {
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  youtubeVideoId?: string | null;
  uploadDate?: string | null;
}) {
  // Temporary placeholder until the video's actual publication date is entered in Sanity.
  const uploadDate = input.uploadDate || '2000-01-01T00:00:00Z';
  const directVideoUrl = input.videoUrl?.match(/\.(?:mp4|webm|mov|m4v|m3u8)(?:[?#]|$)/i)
    ? input.videoUrl
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.title,
    description: input.description?.trim() || '',
    ...(input.thumbnailUrl ? { thumbnailUrl: input.thumbnailUrl } : {}),
    ...(directVideoUrl ? { contentUrl: directVideoUrl } : {}),
    uploadDate,
    ...(input.youtubeVideoId
      ? { embedUrl: `https://www.youtube.com/embed/${input.youtubeVideoId}` }
      : {}),
    author: buildPersonReference(),
  };
}

export function buildPhotographyStructuredData(input: {
  slug: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  width?: number | null;
  height?: number | null;
  capturedAt?: string | null;
  placeName?: string | null;
}) {
  const pageUrl = `${SITE_URL}/photography/${input.slug}`;
  const description = truncate(input.description ?? '') || `Photograph: ${input.title}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': pageUrl,
    url: pageUrl,
    name: input.title,
    description,
    ...(input.imageUrl ? { contentUrl: input.imageUrl, thumbnailUrl: input.imageUrl } : {}),
    ...(input.width && input.height
      ? {
          width: { '@type': 'QuantitativeValue', value: input.width, unitCode: 'PX' },
          height: { '@type': 'QuantitativeValue', value: input.height, unitCode: 'PX' },
        }
      : {}),
    ...(input.capturedAt ? { dateCreated: input.capturedAt } : {}),
    creator: buildPersonReference(),
    copyrightNotice: 'Henrik Sissener',
    creditText: 'Henrik Sissener',
    representativeOfPage: { '@type': 'WebPage', '@id': pageUrl },
    ...(input.placeName ? { contentLocation: { '@type': 'Place', name: input.placeName } } : {}),
  };
}

export function buildRecipeStructuredData(input: {
  slug: string;
  title: string;
  description?: string | null;
  imageUrls?: string[];
  publishedAt?: string | null;
  updatedAt?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  totalTime?: number | null;
  servings?: number | null;
  recipeCategory?: string | null;
  recipeCuisine?: string | null;
  ingredients?: string[];
  instructions?: Array<{ title?: string | null; text: string }>;
  tags?: string[];
  averageRating?: number | null;
  ratingCount?: number | null;
}) {
  const url = `${SITE_URL}/recipes/${input.slug}`;

  function formatDuration(minutes: number | null | undefined): string | undefined {
    if (!minutes || minutes <= 0) return undefined;
    return `PT${minutes}M`;
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Recipes', item: `${SITE_URL}/recipes` },
          { '@type': 'ListItem', position: 3, name: input.title, item: url },
        ],
      },
      {
        '@type': 'Recipe',
        '@id': url,
        inLanguage: 'en',
        name: input.title,
        description: input.description?.trim() || `Home-cooked ${input.title} by Henrik Sissener.`,
        ...(input.imageUrls?.length ? { image: input.imageUrls } : {}),
        author: {
          '@type': 'Person',
          name: 'Henrik Wilhelm Sissener',
          alternateName: 'WiSiHe',
          url: `${SITE_URL}/about`,
        },
        datePublished: input.publishedAt ?? undefined,
        dateModified: input.updatedAt ?? input.publishedAt ?? undefined,
        prepTime: formatDuration(input.prepTime),
        cookTime: formatDuration(input.cookTime),
        totalTime: formatDuration(input.totalTime),
        recipeYield: input.servings ? `${input.servings} servings` : undefined,
        ...(input.recipeCategory?.trim() ? { recipeCategory: input.recipeCategory.trim() } : {}),
        ...(input.recipeCuisine?.trim() ? { recipeCuisine: input.recipeCuisine.trim() } : {}),
        keywords: input.tags?.join(', '),
        recipeIngredient: input.ingredients ?? [],
        recipeInstructions:
          input.instructions?.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            ...(step.title?.trim() ? { name: step.title.trim() } : {}),
            text: step.text,
            url: `${url}#step-${index + 1}`,
          })) ?? [],
        ...(input.ratingCount && input.averageRating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: input.averageRating,
                ratingCount: input.ratingCount,
              },
            }
          : {}),
      },
    ],
  };
}

export { buildAboutStructuredData } from '../../about/buildAboutStructuredData';
