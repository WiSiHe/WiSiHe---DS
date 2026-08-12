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
  nerdLevel?: number;
}

export interface Example {
  name: string;
  description: string;
  iframe?: string;
  image?: string;
  url?: string;
}

export type ContentItem = string | { text: string; url?: string; children?: ContentItem[] };

export interface Metric {
  label: string;
  value: string;
  description?: string;
  color?: string;
}

export interface PortableTextBlockLike {
  _type: string;
  _key?: string;
  children?: unknown[];
  markDefs?: unknown[];
  style?: string;
  listItem?: string;
  level?: number;
}

export type SlideContent = PortableTextBlockLike[] | ContentItem[] | null;

export interface PresentationSlide {
  title: string;
  subtitle?: string;
  content: SlideContent;
  type: 'title' | 'content' | 'separator';
  image?: string | { asset: { _ref: string }; alt?: string };
  imageAspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'auto' | string;
  videoUrl?: string;
  iframe?: string;
  iframeAspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'auto' | string;
  metrics?: Metric[];
  chartType?: 'performance' | 'business-impact' | 'engagement' | 'history-timeline';
  customComponent?: string;
  customProps?: Record<string, unknown>;
  slideDesign?: 'default' | 'centered' | 'split' | 'full-width' | 'minimal' | 'hero' | 'bold';
  category?: string;
  tools?: Tool[];
  examples?: Example[];
  sources?: Source[];
}
