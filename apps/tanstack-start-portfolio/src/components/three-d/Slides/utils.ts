import type { ContentItem, PortableTextBlockLike, SlideContent } from '@/lib/three-d/types';

// Type guard to check if content is Portable Text (from Sanity) vs ContentItem[] (static fallback)
export function isPortableText(content: SlideContent): content is PortableTextBlockLike[] {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return false;
  }
  // Portable Text blocks have _type and typically children/markDefs
  const firstItem = content[0];
  return (
    typeof firstItem === 'object' &&
    firstItem !== null &&
    '_type' in firstItem &&
    typeof firstItem._type === 'string'
  );
}

// Type guard to check if content is ContentItem[] (static fallback)
export function isContentItemArray(content: SlideContent): content is ContentItem[] {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return false;
  }
  const firstItem = content[0];
  // ContentItem is either a string or an object with 'text' property (no _type)
  return typeof firstItem === 'string' || (typeof firstItem === 'object' && 'text' in firstItem);
}

// Helper function to map aspect ratio strings to Tailwind classes
export const getAspectRatioClass = (ratio?: string): string => {
  if (!ratio) return 'aspect-video';
  const map: Record<string, string> = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[4/3]',
    landscape: 'aspect-[3/2]',
    auto: '',
  };
  return map[ratio] || ratio; // Use custom string as-is if not in map
};

export type SlideDesign = 'default' | 'centered' | 'split' | 'full-width' | 'minimal' | 'hero';

export const getLayoutClasses = (slideDesign: SlideDesign) => {
  switch (slideDesign) {
    case 'centered':
      return 'flex flex-col items-center justify-center gap-8 lg:gap-12';
    case 'split':
      return 'flex flex-col lg:flex-row gap-8 lg:gap-12';
    case 'full-width':
      return 'flex flex-col gap-8 lg:gap-12';
    case 'minimal':
      return 'flex flex-col lg:flex-row gap-4 lg:gap-6';
    case 'hero':
      return 'flex flex-col items-center justify-center gap-12 lg:gap-16';
    default: // 'default'
      return 'flex flex-col lg:flex-row gap-8 lg:gap-12';
  }
};

export const getContentClasses = (slideDesign: SlideDesign) => {
  switch (slideDesign) {
    case 'centered':
      return 'flex-1 flex flex-col items-center text-center space-y-6 max-w-4xl';
    case 'full-width':
      return 'w-full flex flex-col justify-center space-y-6';
    case 'minimal':
      return 'flex-1 flex flex-col justify-center space-y-3';
    case 'hero':
      return 'flex-1 flex flex-col items-center text-center space-y-10 max-w-5xl';
    default:
      return 'flex-1 flex flex-col justify-center space-y-6';
  }
};

export const getTitleClasses = (slideDesign: SlideDesign) => {
  switch (slideDesign) {
    case 'minimal':
      return 'text-3xl md:text-4xl lg:text-5xl';
    case 'hero':
      return 'text-5xl md:text-7xl lg:text-8xl xl:text-9xl';
    case 'centered':
      return 'text-4xl md:text-6xl lg:text-7xl xl:text-8xl';
    default:
      return 'text-4xl md:text-6xl lg:text-7xl';
  }
};

export const getSubtitleClasses = (slideDesign: SlideDesign) => {
  switch (slideDesign) {
    case 'minimal':
      return 'text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 lg:mb-12';
    case 'hero':
      return 'text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-10 lg:mb-12';
    default:
      return 'text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-10 lg:mb-12';
  }
};

export const getMediaContainerClasses = (slideDesign: SlideDesign) => {
  const baseClasses = 'max-w-full overflow-hidden min-w-0';
  switch (slideDesign) {
    case 'centered':
      return `w-full max-w-4xl flex items-center justify-center ${baseClasses}`;
    case 'full-width':
      return `w-full flex items-center justify-center ${baseClasses}`;
    case 'minimal':
      return `shrink-0 lg:w-1/2 flex items-center justify-center ${baseClasses}`;
    case 'hero':
      return `w-full max-w-6xl flex items-center justify-center ${baseClasses}`;
    default:
      return `shrink-0 lg:w-1/2 flex items-center justify-center ${baseClasses}`;
  }
};
