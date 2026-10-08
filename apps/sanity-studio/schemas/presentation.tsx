import { PresentationIcon } from '@sanity/icons/Presentation';
import { defineField, defineType, type ValidationContext } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { tag } from './tag';

// Source object type (inline)
const sourceType = defineType({
  name: 'presentationSource',
  title: 'Source',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      url: 'url',
    },
    prepare({ text, url }: { text?: string; url?: string }) {
      return {
        title: text || 'Source',
        subtitle: url || 'No URL',
      };
    },
  },
});

// Tool object type (inline)
const toolType = defineType({
  name: 'presentationTool',
  title: 'Tool',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'workshopUrl',
      title: 'Workshop URL',
      type: 'url',
    }),
    defineField({
      name: 'nerdLevel',
      title: 'Nerd Level',
      type: 'number',
      description: '1-5 scale, where 1 = not nerdy (accessible) and 5 = very nerdy (advanced)',
      validation: Rule => Rule.min(1).max(5).integer(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      category: 'category',
      nerdLevel: 'nerdLevel',
    },
    prepare({
      name,
      category,
      nerdLevel,
    }: {
      name?: string;
      category?: string;
      nerdLevel?: number;
    }) {
      return {
        title: name || 'Tool',
        subtitle: category ? `${category}${nerdLevel ? ` • Level ${nerdLevel}` : ''}` : undefined,
      };
    },
  },
});

// Example object type (inline)
const exampleType = defineType({
  name: 'presentationExample',
  title: 'Example',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'iframe',
      title: 'Iframe URL',
      type: 'url',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      description: 'description',
      image: 'image',
    },
    prepare({
      name,
      description,
      image,
    }: {
      name?: string;
      description?: string;
      image?: unknown;
    }) {
      return {
        title: name || 'Example',
        subtitle: description,
        media: image,
      };
    },
  },
});

// Metric object type (inline)
const metricType = defineType({
  name: 'presentationMetric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Metric label (e.g., "Conversions", "Returns", "Cost Savings")',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Metric value (e.g., "+94%", "-40%", "$50K saved")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional context or explanation for this metric',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Optional color for visual distinction (hex code or CSS color)',
      options: {
        list: [
          { title: 'Green (Positive)', value: '#22c55e' },
          { title: 'Red (Negative)', value: '#ef4444' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Purple', value: '#a855f7' },
          { title: 'Orange', value: '#f97316' },
          { title: 'Teal', value: '#14b8a6' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      label: 'label',
      value: 'value',
      color: 'color',
    },
    prepare({ label, value, color }: { label?: string; value?: string; color?: string }) {
      return {
        title: label || 'Untitled Metric',
        subtitle: value || 'No value',
        media: color ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: color,
              borderRadius: '4px',
            }}
          />
        ) : undefined,
      };
    },
  },
});

// Media type - discriminated union for single media per slide
const mediaType = defineType({
  name: 'presentationMedia',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Iframe', value: 'iframe' },
          { title: 'Numbers', value: 'numbers' },
          { title: 'Graph/Chart', value: 'graph' },
          { title: 'Custom Component', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      description:
        'Choose one media type per slide. Numbers: Display structured metrics in a grid. Graph/Chart: Display performance, business impact, engagement, or history timeline charts. Custom Component: Render a custom React component by name with JSON props.',
    }),
    // Image fields
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
        }),
      ],
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'image',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'image' && !value) {
            return 'Image is required when Media Type is Image';
          }
          return true;
        }),
    }),
    defineField({
      name: 'imageAspectRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      description: 'Aspect ratio for the image display',
      options: {
        list: [
          { title: 'Video (16:9)', value: 'video' },
          { title: 'Square (1:1)', value: 'square' },
          { title: 'Portrait (4:3)', value: 'portrait' },
          { title: 'Landscape (3:2)', value: 'landscape' },
          { title: 'Auto (natural)', value: 'auto' },
        ],
      },
      initialValue: 'video',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'image',
    }),
    // Video fields
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'URL to the video (YouTube, Vimeo, etc.)',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'video',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'video' && !value) {
            return 'Video URL is required when Media Type is Video';
          }
          return true;
        }),
    }),
    // Iframe fields
    defineField({
      name: 'iframeUrl',
      title: 'Iframe URL',
      type: 'url',
      description: 'URL for embedded iframe content',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'iframe',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'iframe' && !value) {
            return 'Iframe URL is required when Media Type is Iframe';
          }
          return true;
        }),
    }),
    defineField({
      name: 'iframeAspectRatio',
      title: 'Iframe Aspect Ratio',
      type: 'string',
      description: 'Aspect ratio for the iframe display',
      options: {
        list: [
          { title: 'Video (16:9)', value: 'video' },
          { title: 'Square (1:1)', value: 'square' },
          { title: 'Portrait (4:3)', value: 'portrait' },
          { title: 'Landscape (3:2)', value: 'landscape' },
          { title: 'Auto (natural)', value: 'auto' },
        ],
      },
      initialValue: 'video',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'iframe',
    }),
    // Numbers fields
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [{ type: 'presentationMetric' }],
      description:
        'Add metrics with label (e.g., "Conversions"), value (e.g., "+94%"), optional description, and optional color. These will be displayed in a responsive grid layout on the slide.',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'numbers',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'numbers' && (!value || value.length === 0)) {
            return 'At least one metric is required when Media Type is Numbers';
          }
          return true;
        }),
    }),
    // Graph/Chart fields
    defineField({
      name: 'chartType',
      title: 'Chart Type',
      type: 'string',
      description:
        'Select the type of chart to display: Performance (performance metrics), Business Impact (business metrics), Engagement (user engagement), or History Timeline (hardcoded 4-milestone timeline: Plugin Era → WebGL → Three.js → Collaborative Era).',
      options: {
        list: [
          { title: 'Performance', value: 'performance' },
          { title: 'Business Impact', value: 'business-impact' },
          { title: 'Engagement', value: 'engagement' },
          { title: 'History Timeline', value: 'history-timeline' },
        ],
      },
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'graph',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'graph' && !value) {
            return 'Chart Type is required when Media Type is Graph/Chart';
          }
          return true;
        }),
    }),
    // Custom component fields
    defineField({
      name: 'componentName',
      title: 'Component Name',
      type: 'string',
      description:
        'Name of the React component to render (e.g., "MyCustom3DComponent"). The component must be available in the codebase and exported from the components directory.',
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'custom',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'custom' && !value) {
            return 'Component Name is required when Media Type is Custom Component';
          }
          return true;
        }),
    }),
    defineField({
      name: 'componentProps',
      title: 'Component Props',
      type: 'text',
      description:
        'Props to pass to the custom component as a JSON string. Example: {"color": "red", "size": 10}. Must be valid JSON format.',
      rows: 6,
      hidden: ({ parent }: { parent?: { mediaType?: string } }) => parent?.mediaType !== 'custom',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === 'custom' && value) {
            try {
              JSON.parse(value);
              return true;
            } catch (_e) {
              return 'Must be valid JSON';
            }
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      mediaType: 'mediaType',
      image: 'image',
      chartType: 'chartType',
      componentName: 'componentName',
      metrics: 'metrics',
    },
    prepare({
      mediaType,
      image,
      chartType,
      componentName,
      metrics,
    }: {
      mediaType?: string;
      image?: unknown;
      chartType?: string;
      componentName?: string;
      metrics?: unknown[];
    }) {
      const titles: Record<string, string> = {
        none: 'No Media',
        image: 'Image',
        video: 'Video',
        iframe: 'Iframe',
        numbers: metrics && metrics.length > 0 ? `Numbers (${metrics.length} metrics)` : 'Numbers',
        graph: chartType ? `Chart: ${chartType}` : 'Graph/Chart',
        custom: componentName ? `Component: ${componentName}` : 'Custom Component',
      };
      return {
        title: titles[mediaType || ''] || 'Media',
        media: image,
      };
    },
  },
});

// Content Slide block type
const contentSlideType = defineType({
  name: 'contentSlide',
  title: 'Content Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      description:
        'Control whether this slide is displayed. Published = visible, Draft = work in progress, Hidden = not displayed.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description:
        'Rich text content with support for links, lists, and formatting. Use bullet lists for main points and nested lists for sub-bullets.',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'presentationMedia',
      description:
        'Optional: Choose one media type: Image, Video, Iframe, Graph/Chart, or Custom Component. Leave empty for text-only slides.',
    }),
    defineField({
      name: 'slideDesign',
      title: 'Slide Design',
      type: 'string',
      description: 'Visual design/layout style for this slide',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Centered', value: 'centered' },
          { title: 'Split', value: 'split' },
          { title: 'Full Width', value: 'full-width' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'presentationCategory' }],
      description: 'Category for grouping slides (e.g., Introduction, History, etc.)',
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [{ type: 'presentationSource' }],
    }),
    defineField({
      name: 'tools',
      title: 'Tools',
      type: 'array',
      of: [{ type: 'presentationTool' }],
    }),
    defineField({
      name: 'examples',
      title: 'Examples',
      type: 'array',
      of: [{ type: 'presentationExample' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      category: 'category.name',
      mediaType: 'media.mediaType',
      slideDesign: 'slideDesign',
      status: 'status',
    },
    prepare({
      title,
      subtitle,
      category,
      mediaType,
      slideDesign,
      status,
    }: {
      title?: string;
      subtitle?: string;
      category?: string;
      mediaType?: string;
      slideDesign?: string;
      status?: string;
    }) {
      const statusBadge = status && status !== 'published' ? `[${status}]` : '';
      return {
        title: statusBadge
          ? `${statusBadge} ${title || 'Untitled Content Slide'}`
          : title || 'Untitled Content Slide',
        subtitle:
          [subtitle, category, mediaType, slideDesign].filter(Boolean).join(' • ') ||
          'Content Slide',
      };
    },
  },
});

// Title Slide block type
const titleSlideType = defineType({
  name: 'titleSlide',
  title: 'Title Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      description:
        'Control whether this slide is displayed. Published = visible, Draft = work in progress, Hidden = not displayed.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'presentationMedia',
      description: 'Optional media for the title slide',
    }),
    defineField({
      name: 'slideDesign',
      title: 'Slide Design',
      type: 'string',
      description: 'Visual design/layout style for this slide',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Centered', value: 'centered' },
          { title: 'Hero', value: 'hero' },
          { title: 'Minimal', value: 'minimal' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      mediaType: 'media.mediaType',
      status: 'status',
    },
    prepare({
      title,
      subtitle,
      mediaType,
      status,
    }: {
      title?: string;
      subtitle?: string;
      mediaType?: string;
      status?: string;
    }) {
      const statusBadge = status && status !== 'published' ? `[${status}]` : '';
      return {
        title: statusBadge
          ? `${statusBadge} ${title || 'Untitled Title Slide'}`
          : title || 'Untitled Title Slide',
        subtitle: [subtitle, mediaType].filter(Boolean).join(' • ') || 'Title Slide',
      };
    },
  },
});

// Separator Slide block type
const separatorSlideType = defineType({
  name: 'separatorSlide',
  title: 'Separator Slide',
  type: 'object',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Hidden', value: 'hidden' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      description:
        'Control whether this slide is displayed. Published = visible, Draft = work in progress, Hidden = not displayed.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The text displayed on the separator slide',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'presentationCategory' }],
      description: 'Category reference (e.g., "Introduction", "History", etc.)',
    }),
    defineField({
      name: 'slideDesign',
      title: 'Slide Design',
      type: 'string',
      description: 'Visual design/layout style for this separator',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Bold', value: 'bold' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
      slideDesign: 'slideDesign',
      status: 'status',
    },
    prepare({
      title,
      category,
      slideDesign,
      status,
    }: {
      title?: string;
      category?: string;
      slideDesign?: string;
      status?: string;
    }) {
      const statusBadge = status && status !== 'published' ? `[${status}]` : '';
      return {
        title: statusBadge
          ? `${statusBadge} ${title || 'Untitled Separator'}`
          : title || 'Untitled Separator',
        subtitle: [category, slideDesign].filter(Boolean).join(' • ') || 'Separator Slide',
      };
    },
  },
});

// Main presentation schema - contains an array of different slide types
export default defineType({
  name: 'presentation',
  title: 'Presentation',
  type: 'document',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Presentation Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The name/title of this presentation',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly identifier for this presentation',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description of the presentation',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Optional overrides for search and social previews.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: tag.name } }],
      description: 'Tags for categorizing this presentation',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'noIndex',
      title: 'Exclude from Search Engines (noIndex)',
      type: 'boolean',
      description: 'If checked, search engines will be instructed not to index this presentation.',
      initialValue: false,
    }),
    defineField({
      name: 'tldr',
      title: 'TL;DR Summary',
      type: 'text',
      description: 'A brief, high-level summary of the presentation. Can be generated using AI.',
      rows: 4,
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt="Write a concise, scannable TL;DR bullet-point summary for the presentation '{presentationTitle}' based on its description: '{presentationDescription}'."
            fieldDependencies={{
              presentationTitle: 'title',
              presentationDescription: 'description',
            }}
            characterLimit={500}
            rows={4}
            placeholder='AI-generated TL;DR summary will appear here...'
            transformResponse={response => response.replace(/^["']|["']$/g, '').trim()}
          />
        ),
      },
    }),
    defineField({
      name: 'tldrPosition',
      title: 'TL;DR Position',
      type: 'string',
      description: 'Where to display the TL;DR slide in the presentation deck.',
      options: {
        list: [
          { title: 'Top (After Title/Hero Slide)', value: 'top' },
          { title: 'Bottom (Before Sources Slide)', value: 'bottom' },
        ],
      },
      initialValue: 'top',
      hidden: ({ document }) => !document?.tldr,
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [{ type: 'contentSlide' }, { type: 'titleSlide' }, { type: 'separatorSlide' }],
      description:
        'The slides in this presentation. Drag to reorder. Choose from Content Slide, Title Slide, or Separator Slide.',
      validation: Rule => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      slidesCount: 'slides',
    },
    prepare({
      title,
      description,
      slidesCount,
    }: {
      title?: string;
      description?: string;
      slidesCount?: unknown[];
    }) {
      const count = Array.isArray(slidesCount) ? slidesCount.length : 0;
      return {
        title: title || 'Untitled Presentation',
        subtitle: description
          ? `${description.substring(0, 50)}${description.length > 50 ? '...' : ''} • ${count} slide${count !== 1 ? 's' : ''}`
          : `${count} slide${count !== 1 ? 's' : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Title (Z-A)',
      name: 'titleDesc',
      by: [{ field: 'title', direction: 'desc' }],
    },
    {
      title: 'Created (newest first)',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Created (oldest first)',
      name: 'createdAsc',
      by: [{ field: '_createdAt', direction: 'asc' }],
    },
  ],
});

// Export supporting types for use in other schemas if needed
export {
  contentSlideType,
  exampleType,
  mediaType,
  metricType,
  separatorSlideType,
  sourceType,
  titleSlideType,
  toolType,
};
