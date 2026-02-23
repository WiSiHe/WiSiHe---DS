import { defineArrayMember, defineField, defineType, type ValidationContext } from 'sanity';

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike-through', value: 'strike-through' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    { title: 'URL', value: 'href' },
                    { title: 'slug', value: 'slug' },
                    { title: 'Painting', value: 'painting' },
                    { title: 'Project', value: 'project' },
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'href' && parent?.linkType != null,
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'slug',
                title: 'Slug',
                type: 'string',
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'slug',
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'slug' && !value) {
                      return 'Slug is required when Link Type is Slug';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'painting',
                title: 'Painting',
                type: 'reference',
                to: [{ type: 'painting' }],
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'painting',
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'painting' && !value) {
                      return 'Painting reference is required when Link Type is Painting';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'project',
                title: 'Project',
                type: 'reference',
                to: [{ type: 'project' }],
                hidden: ({ parent }: { parent?: { linkType?: string } }) =>
                  parent?.linkType !== 'project',
                validation: Rule =>
                  Rule.custom((value, context: ValidationContext) => {
                    const parent = context.parent as { linkType?: string } | undefined;
                    if (parent?.linkType === 'project' && !value) {
                      return 'Project reference is required when Link Type is Project';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    // Add image support to Portable Text
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true, // Enables the hotspot feature for better image cropping
      },
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
          description: 'Optional caption to display below the image.',
        }),
      ],
    }),
    // Add code block support
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
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
        select: {
          code: 'code',
          language: 'language',
        },
        prepare({ code, language }: { code?: string; language?: string }) {
          const preview = code
            ? code.substring(0, 50) + (code.length > 50 ? '...' : '')
            : 'No code';
          return {
            title: `Code Block (${language || 'javascript'})`,
            subtitle: preview,
          };
        },
      },
    }),
    // Add callout/alert blocks
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
        select: {
          title: 'title',
          type: 'type',
        },
        prepare({ title, type }: { title?: string; type?: string }) {
          return {
            title: title || 'Callout',
            subtitle: type ? `${type.charAt(0).toUpperCase() + type.slice(1)} callout` : 'Callout',
          };
        },
      },
    }),
    // Add recipe tip blocks
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
          description: 'e.g., "Pro Tip", "Time Saver", "Flavor Boost"',
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
        select: {
          title: 'title',
          icon: 'icon',
          type: 'type',
        },
        prepare({ title, icon, type }: { title?: string; icon?: string; type?: string }) {
          return {
            title: `${icon || '💡'} ${title || 'Recipe Tip'}`,
            subtitle: `Type: ${type || 'pro'}`,
          };
        },
      },
    }),
    // Add video embed support
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
          description: 'Optional title for the video',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'text',
          description: 'Optional caption below the video',
        }),
      ],
      preview: {
        select: {
          title: 'title',
          url: 'url',
        },
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
