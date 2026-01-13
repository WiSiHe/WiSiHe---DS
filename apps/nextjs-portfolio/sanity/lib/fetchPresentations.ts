import { sanityFetch } from './live';
import { presentationQuery } from './queries';
import type { PresentationSlide, Source, Tool, Example } from '@/app/three-d/types';

// Type for the raw Sanity presentation response
interface SanityPresentationResponse {
  slides?: Array<{
    _type: string;
    title?: string;
    subtitle?: string;
    content?: unknown;
    media?: {
      mediaType?: string;
      image?: { url?: string } | string;
      imageAspectRatio?: string;
      videoUrl?: string;
      iframeUrl?: string;
      iframeAspectRatio?: string;
      metrics?: unknown[];
      chartType?: string;
      componentName?: string;
      componentProps?: string;
    };
    slideDesign?: string;
    category?: { name?: string } | string;
    status?: string;
    sources?: Array<{ text?: string; url?: string }>;
    tools?: Array<{
      name?: string;
      description?: string;
      url?: string;
      category?: string;
      workshopUrl?: string;
      nerdLevel?: number;
    }>;
    examples?: Array<{
      name?: string;
      description?: string;
      image?: { url?: string } | string;
      iframe?: string;
      url?: string;
    }>;
  }>;
}

/**
 * Fetches a presentation with its slides from Sanity
 * @param slug - The slug of the presentation to fetch (defaults to 'three-d' for the main presentation)
 * @returns Array of slides or null if not found
 */
export async function fetchPresentationSlides(
  slug: string = 'three-d',
): Promise<PresentationSlide[] | null> {
  try {
    const result = await sanityFetch({
      query: presentationQuery,
      params: { slug },
    });

    // Cast to expected type since sanityFetch returns generic data
    const data = result.data as SanityPresentationResponse | null;

    if (!data || !data.slides || !Array.isArray(data.slides)) {
      return null;
    }

    // Transform Sanity slides to PresentationSlide format
    // Each slide has a _type field that indicates its block type
    // Filter out slides that are not published (status !== 'published')
    return data.slides
      .filter((slide: any) => !slide.status || slide.status === 'published')
      .map((slide: any) => {
        // Determine the type based on _type field
        let type: 'title' | 'content' | 'separator' = 'content';
        if (slide._type === 'titleSlide') {
          type = 'title';
        } else if (slide._type === 'separatorSlide') {
          type = 'separator';
        } else if (slide._type === 'contentSlide') {
          type = 'content';
        }

        // Extract media based on mediaType
        const extractMedia = (media: any) => {
          if (!media || media.mediaType === 'none') return {};

          const mediaType = media.mediaType;
          const result: any = {};

          if (mediaType === 'image') {
            result.image = media.image?.url || media.image;
            result.imageAspectRatio = media.imageAspectRatio;
          } else if (mediaType === 'video') {
            result.videoUrl = media.videoUrl;
          } else if (mediaType === 'iframe') {
            result.iframe = media.iframeUrl;
            result.iframeAspectRatio = media.iframeAspectRatio;
          } else if (mediaType === 'numbers') {
            result.metrics = media.metrics || [];
          } else if (mediaType === 'graph') {
            result.chartType = media.chartType;
          } else if (mediaType === 'custom') {
            result.customComponent = media.componentName;
            // Parse JSON string if it exists
            if (media.componentProps) {
              try {
                result.customProps = JSON.parse(media.componentProps);
              } catch (e) {
                console.warn('Failed to parse componentProps JSON:', e);
                result.customProps = {};
              }
            } else {
              result.customProps = {};
            }
          }

          return result;
        };

        // Extract category name from reference
        const categoryName = slide.category?.name || slide.category;

        // Base fields common to all slide types
        const baseSlide: any = {
          title: slide.title || '',
          subtitle: slide.subtitle,
          type,
          category: categoryName,
          slideDesign: slide.slideDesign,
        };

        // Add type-specific fields
        if (type === 'content') {
          const mediaData = extractMedia(slide.media);
          return {
            ...baseSlide,
            // Pass raw Portable Text blocks directly - they will be rendered by PresentationPortableText
            content: slide.content || null,
            ...mediaData,
            sources: slide.sources?.map((source: any) => ({
              text: source.text || '',
              url: source.url,
            })) as Source[] | undefined,
            tools: slide.tools?.map((tool: any) => ({
              name: tool.name || '',
              description: tool.description || '',
              url: tool.url || '',
              category: tool.category,
              workshopUrl: tool.workshopUrl,
              nerdLevel: tool.nerdLevel,
            })) as Tool[] | undefined,
            examples: slide.examples?.map((example: any) => ({
              name: example.name || '',
              description: example.description || '',
              image: example.image?.url || example.image,
              iframe: example.iframe,
              url: example.url,
            })) as Example[] | undefined,
          } as PresentationSlide;
        } else if (type === 'title') {
          const mediaData = extractMedia(slide.media);
          return {
            ...baseSlide,
            content: null,
            ...mediaData,
          } as PresentationSlide;
        } else {
          // separator
          return {
            ...baseSlide,
            content: null,
          } as PresentationSlide;
        }
      });
  } catch (error) {
    console.error('Error fetching presentation from Sanity:', error);
    return null;
  }
}

// Note: The convertPortableTextToContentItems function and related helpers have been removed.
// Portable Text blocks are now passed directly to the PresentationPortableText component
// which handles all rich text rendering including links, formatting, lists, etc.
