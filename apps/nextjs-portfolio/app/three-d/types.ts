export type SlideMode =
  | 'threejs-intro'
  | 'react-basics'
  | 'textures'
  | 'intro'
  | 'vertices'
  | 'edges'
  | 'faces'
  | 'showcase'
  | 'r3f-first-scene'
  | 'r3f-basics'
  | 'r3f-materials'
  | 'r3f-geometries';

export interface Slide {
  title: string;
  description: string;
  code?: string;
  mode: SlideMode;
  links?: Array<{ text: string; url: string }>;
}

export interface Source {
  text: string;
  url?: string;
}

export interface Tool {
  name: string;
  description: string;
  url: string;
  category?: string;
  workshopUrl?: string;
  nerdLevel?: number; // 1-5 scale, where 1 = not nerdy (accessible) and 5 = very nerdy (advanced)
}

export interface Example {
  name: string;
  description: string;
  iframe?: string;
  image?: string;
  url?: string;
}

// Support for nested content items (main bullets with sub-bullets and links)
// Used for static fallback slides
export type ContentItem = string | { text: string; url?: string; children?: ContentItem[] };

export interface Metric {
  label: string;
  value: string;
  description?: string;
  color?: string;
}

// Portable Text block type (simplified for type checking)
// Full type comes from next-sanity's PortableTextBlock
export interface PortableTextBlockLike {
  _type: string;
  _key?: string;
  children?: unknown[];
  markDefs?: unknown[];
  style?: string;
  listItem?: string;
  level?: number;
}

// Content can be either:
// - PortableTextBlock[] from Sanity (rich text with formatting)
// - ContentItem[] from static fallback slides (simple text/links)
export type SlideContent = PortableTextBlockLike[] | ContentItem[] | null;

export interface PresentationSlide {
  title: string;
  subtitle?: string;
  content: SlideContent;
  type: 'title' | 'content' | 'separator';
  // Media fields (only one will be set based on mediaType)
  image?: string;
  imageAspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'auto' | string;
  videoUrl?: string;
  iframe?: string;
  iframeAspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'auto' | string;
  metrics?: Metric[];
  chartType?: 'performance' | 'business-impact' | 'engagement' | 'history-timeline';
  currentEra?: string; // Used for history timeline to indicate which era is active
  customComponent?: string;
  customProps?: Record<string, any>;
  // Design and organization
  slideDesign?: 'default' | 'centered' | 'split' | 'full-width' | 'minimal' | 'hero' | 'bold';
  category?: string;
  // Additional content
  tools?: Tool[];
  examples?: Example[];
  sources?: Source[];
}
