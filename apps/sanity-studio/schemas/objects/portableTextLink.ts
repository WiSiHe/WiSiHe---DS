import { defineField, type ValidationContext } from 'sanity';

export const portableTextLinkAnnotation = {
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      initialValue: 'href',
      options: {
        list: [
          { title: 'External URL', value: 'href' },
          { title: 'Internal path', value: 'slug' },
          { title: 'Painting', value: 'painting' },
          { title: 'Project', value: 'project' },
          { title: 'Recipe', value: 'recipe' },
          { title: 'Video', value: 'video' },
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
            return 'URL is required';
          }
          return true;
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Path',
      type: 'string',
      description: 'Site path, e.g. /about or /paintings',
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'slug',
      validation: Rule =>
        Rule.custom((value, context: ValidationContext) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === 'slug' && !value) {
            return 'Path is required';
          }
          return true;
        }),
    }),
    defineField({
      name: 'painting',
      title: 'Painting',
      type: 'reference',
      to: [{ type: 'painting' }],
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'painting',
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{ type: 'project' }],
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'project',
    }),
    defineField({
      name: 'recipe',
      title: 'Recipe',
      type: 'reference',
      to: [{ type: 'recipe' }],
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'recipe',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'reference',
      to: [{ type: 'video' }],
      hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'video',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }: { parent?: { linkType?: string } }) =>
        parent?.linkType === 'slug' ||
        parent?.linkType === 'painting' ||
        parent?.linkType === 'project' ||
        parent?.linkType === 'recipe' ||
        parent?.linkType === 'video',
    }),
  ],
};
