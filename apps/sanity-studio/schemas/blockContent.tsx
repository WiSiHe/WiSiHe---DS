import { defineArrayMember, defineField, defineType } from 'sanity';
import { portableTextLinkAnnotation } from './objects/portableTextLink';

const bodyBlockStyles = [
  { title: 'Normal', value: 'normal' },
  { title: 'H2', value: 'h2' },
  { title: 'H3', value: 'h3' },
  { title: 'H4', value: 'h4' },
  { title: 'Quote', value: 'blockquote' },
];

const bodyDecorators = [
  { title: 'Strong', value: 'strong' },
  { title: 'Emphasis', value: 'em' },
  { title: 'Code', value: 'code' },
  { title: 'Underline', value: 'underline' },
  { title: 'Strike-through', value: 'strike-through' },
];

/**
 * Rich text for long-form content (posts, recipes, project bodies).
 * Use `blockContentMinimal` for short intros and section blurbs.
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: bodyBlockStyles,
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: bodyDecorators,
        annotations: [portableTextLinkAnnotation],
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          initialValue: 'line',
          options: {
            list: [
              { title: 'Line', value: 'line' },
              { title: 'Space', value: 'space' },
            ],
            layout: 'radio',
          },
        }),
      ],
      preview: {
        select: { style: 'style' },
        prepare({ style }: { style?: string }) {
          return {
            title: 'Divider',
            subtitle: style === 'space' ? 'Spacing' : 'Horizontal line',
          };
        },
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),
    defineArrayMember({
      type: 'code',
      title: 'Code',
      options: {
        withFilename: true,
        languageAlternatives: [
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
          { title: 'Plain text', value: 'text' },
        ],
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code block (legacy)',
      fields: [
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'JSON', value: 'json' },
              { title: 'Python', value: 'python' },
              { title: 'Bash', value: 'bash' },
              { title: 'Plain text', value: 'text' },
            ],
          },
          initialValue: 'javascript',
        }),
      ],
      preview: {
        select: { code: 'code', language: 'language' },
        prepare({ code, language }: { code?: string; language?: string }) {
          const preview = code
            ? code.substring(0, 50) + (code.length > 50 ? '...' : '')
            : 'No code';
          return {
            title: `Code (${language || 'javascript'})`,
            subtitle: preview,
          };
        },
      },
    }),
    defineArrayMember({
      type: 'mermaidDiagram',
      title: 'Mermaid diagram',
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
              { title: 'Error', value: 'error' },
            ],
          },
          initialValue: 'info',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{ type: 'block' }],
        }),
      ],
      preview: {
        select: { title: 'title', type: 'type' },
        prepare({ title, type }: { title?: string; type?: string }) {
          return {
            title: title || 'Callout',
            subtitle: type ? `${type.charAt(0).toUpperCase() + type.slice(1)} callout` : 'Callout',
          };
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'recipeTip',
      title: 'Recipe Tip',
      fields: [
        defineField({
          name: 'icon',
          title: 'Icon',
          type: 'string',
          description: 'Optional emoji or icon (e.g., "💡", "🔥", "⏰")',
        }),
        defineField({
          name: 'title',
          title: 'Tip Title',
          type: 'string',
        }),
        defineField({
          name: 'content',
          title: 'Tip Content',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'type',
          title: 'Tip Type',
          type: 'string',
          options: {
            list: [
              { title: 'Pro Tip', value: 'pro' },
              { title: 'Time Saver', value: 'time' },
              { title: 'Flavor Tip', value: 'flavor' },
              { title: 'Technique', value: 'technique' },
              { title: 'Substitution', value: 'substitution' },
            ],
          },
          initialValue: 'pro',
        }),
      ],
      preview: {
        select: { title: 'title', icon: 'icon', type: 'type' },
        prepare({ title, icon, type }: { title?: string; icon?: string; type?: string }) {
          return {
            title: `${icon || '💡'} ${title || 'Recipe Tip'}`,
            subtitle: `Type: ${type || 'pro'}`,
          };
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube or Vimeo URL',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'text',
        }),
      ],
      preview: {
        select: { title: 'title', url: 'url' },
        prepare({ title, url }: { title?: string; url?: string }) {
          return {
            title: title || 'Video',
            subtitle: url || 'No URL provided',
          };
        },
      },
    }),
  ],
});

// Re-export for schemas that need inline validation on link fields
export { portableTextLinkAnnotation };
