import type { Example, PresentationSlide, Source, Tool } from './types';

type SanitySlide = {
  _type: string;
  status?: string;
  title?: string;
  subtitle?: string;
  content?: unknown;
  slideDesign?: string;
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
  category?: { name?: string } | string;
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
};

function extractMedia(media: SanitySlide['media']) {
  if (!media || media.mediaType === 'none') return {};

  const mediaType = media.mediaType;
  const result: Record<string, unknown> = {};

  if (mediaType === 'image') {
    if (media.image && typeof media.image === 'object' && media.image.asset?._ref) {
      const imagePayload: Record<string, unknown> = {
        _type: 'image',
        asset: {
          _ref: media.image.asset._ref,
          _type: media.image.asset._type,
        },
        alt: media.image.alt,
      };
      if (media.image.hotspot) imagePayload.hotspot = media.image.hotspot;
      if (media.image.crop) imagePayload.crop = media.image.crop;
      result.image = imagePayload;
    } else {
      result.image =
        typeof media.image === 'object' && media.image && 'url' in media.image
          ? media.image.url
          : media.image;
    }
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
    if (media.componentProps) {
      try {
        result.customProps = JSON.parse(media.componentProps);
      } catch {
        result.customProps = {};
      }
    } else {
      result.customProps = {};
    }
  }

  return result;
}

export function transformPresentationSlides(
  slides: SanitySlide[] | null | undefined,
  options?: { includeDrafts?: boolean },
): PresentationSlide[] | null {
  if (!slides?.length) return null;

  return slides
    .filter(slide => options?.includeDrafts || !slide.status || slide.status === 'published')
    .map(slide => {
      let type: 'title' | 'content' | 'separator' = 'content';
      if (slide._type === 'titleSlide') type = 'title';
      else if (slide._type === 'separatorSlide') type = 'separator';

      const categoryName =
        typeof slide.category === 'object' ? slide.category?.name : slide.category;

      const baseSlide = {
        title: slide.title || '',
        subtitle: slide.subtitle,
        type,
        category: categoryName,
        slideDesign: slide.slideDesign as PresentationSlide['slideDesign'],
      };

      if (type === 'content') {
        const mediaData = extractMedia(slide.media);
        return {
          ...baseSlide,
          content: (slide.content as PresentationSlide['content']) || null,
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
              typeof example.image === 'object' ? example.image?.url || undefined : example.image,
            iframe: example.iframe,
            url: example.url,
          })) as Example[] | undefined,
        } satisfies PresentationSlide;
      }

      if (type === 'title') {
        return {
          ...baseSlide,
          content: null,
          ...extractMedia(slide.media),
        } satisfies PresentationSlide;
      }

      return {
        ...baseSlide,
        content: null,
      } satisfies PresentationSlide;
    });
}
