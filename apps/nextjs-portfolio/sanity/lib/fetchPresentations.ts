import type { Example, PresentationSlide, Source, Tool } from '@/app/three-d/types';
import { sanityFetch } from './live';
import { presentationQuery } from './queries';

type SanitySlide = NonNullable<SanityPresentationResponse['slides']>[number];

// Type for the raw Sanity presentation response
interface SanityPresentationResponse {
  slides?: Array<{
    _type: string;
    title?: string;
    subtitle?: string;
    content?: unknown;
    media?: {
      mediaType?: string;
      image?:
        | {
            asset?: { _ref?: string; _type?: string; url?: string };
            alt?: string;
            url?: string;
            hotspot?: unknown;
            crop?: unknown;
          }
        | string;
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

    if (!data?.slides || !Array.isArray(data.slides)) {
      return null;
    }

    // Transform Sanity slides to PresentationSlide format
    // Each slide has a _type field that indicates its block type
    // Filter out slides that are not published (status !== 'published')
    return data.slides
      .filter(slide => !slide.status || slide.status === 'published')
      .map(slide => {
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
        const extractMedia = (media: NonNullable<SanitySlide['media']> | undefined) => {
          if (!media || media.mediaType === 'none') return {};

          const mediaType = media.mediaType;
          const result: Record<string, unknown> = {};
          const mediaImage = typeof media.image === 'object' ? media.image : undefined;

          if (mediaType === 'image') {
            // Preserve the full Sanity image object structure for urlForImage to work
            // If image has asset._ref, use the full object; otherwise fall back to URL string
            if (mediaImage?.asset?._ref) {
              result['image'] = {
                _type: 'image', // Required by @sanity/image-url builder
                asset: {
                  _ref: mediaImage.asset._ref,
                  _type: mediaImage.asset._type,
                },
                alt: mediaImage.alt,
                // Preserve hotspot and crop if they exist (for proper image cropping)
                ...(mediaImage.hotspot ? { hotspot: mediaImage.hotspot } : {}),
                ...(mediaImage.crop ? { crop: mediaImage.crop } : {}),
              };
            } else {
              // Fallback to URL string if asset reference is not available
              result['image'] = mediaImage?.url || media.image;
            }
            result['imageAspectRatio'] = media.imageAspectRatio;
          } else if (mediaType === 'video') {
            result['videoUrl'] = media.videoUrl;
          } else if (mediaType === 'iframe') {
            result['iframe'] = media.iframeUrl;
            result['iframeAspectRatio'] = media.iframeAspectRatio;
          } else if (mediaType === 'numbers') {
            result['metrics'] = media.metrics || [];
          } else if (mediaType === 'graph') {
            result['chartType'] = media.chartType;
          } else if (mediaType === 'custom') {
            result['customComponent'] = media.componentName;
            // Parse JSON string if it exists
            if (media.componentProps) {
              try {
                result['customProps'] = JSON.parse(media.componentProps);
              } catch (e) {
                console.warn('Failed to parse componentProps JSON:', e);
                result['customProps'] = {};
              }
            } else {
              result['customProps'] = {};
            }
          }

          return result;
        };

        // Extract category name from reference
        const categoryName =
          (typeof slide.category === 'object' ? slide.category?.name : undefined) || slide.category;

        // Base fields common to all slide types
        const baseSlide = {
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
            sources: slide.sources?.map(source => ({
              text: source.text || '',
              url: source.url,
            })) as Source[] | undefined,
            tools: slide.tools?.map(tool => ({
              name: tool.name || '',
              description: tool.description || '',
              url: tool.url || '',
              category: tool.category,
              workshopUrl: tool.workshopUrl,
              nerdLevel: tool.nerdLevel,
            })) as Tool[] | undefined,
            examples: slide.examples?.map(example => ({
              name: example.name || '',
              description: example.description || '',
              image:
                (typeof example.image === 'object' ? example.image.url : undefined) ||
                example.image,
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
