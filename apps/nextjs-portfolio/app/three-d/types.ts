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

// Support for nested content items (main bullets with sub-bullets)
export type ContentItem = string | { text: string; children?: ContentItem[] };

export interface PresentationSlide {
  title: string;
  subtitle?: string;
  content: ContentItem[] | null;
  type: 'title' | 'content' | 'separator';
  image?: string;
  iframe?: string;
  tools?: Tool[];
  examples?: Example[];
  sources?: Source[];
  category?: string;
  chartType?: 'performance' | 'business-impact' | 'engagement' | 'history-timeline';
  currentEra?: string;
}
