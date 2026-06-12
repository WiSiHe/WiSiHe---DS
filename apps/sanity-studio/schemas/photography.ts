import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'photography',
  title: 'Photography',
  icon: ImageIcon,
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'location', title: 'Location' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: rule => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      group: 'content',
      options: { hotspot: true, metadata: ['lqip', 'blurhash', 'palette'] },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: rule => rule.required(),
        }),
      ],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short description shown in galleries and previews.',
    }),
    defineField({
      name: 'placeName',
      title: 'Place name',
      type: 'string',
      group: 'location',
      description: 'Where the photo was taken — city, landmark, or area.',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'location',
      description:
        'Used on the about page travel map when the country name matches a visited country.',
    }),
    defineField({
      name: 'region',
      title: 'Region / state',
      type: 'string',
      group: 'location',
      description: 'Optional — county, province, or region.',
    }),
    defineField({
      name: 'coordinates',
      title: 'Map coordinates',
      type: 'geopoint',
      group: 'location',
      description: 'Pin the capture location on a map.',
    }),
    defineField({
      name: 'capturedAt',
      title: 'Captured at',
      type: 'datetime',
      group: 'location',
      description: 'When the photo was taken.',
    }),
    defineField({
      name: 'camera',
      title: 'Camera / equipment',
      type: 'string',
      group: 'content',
      description: 'Optional — body, lens, or phone model.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'tagsV2',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      options: { layout: 'list' },
    }),
    defineField({
      name: 'seo',
      title: 'SEO overrides',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      country: 'country',
      placeName: 'placeName',
      media: 'image',
    },
    prepare({ title, country, placeName, media }) {
      const where = [placeName, country].filter(Boolean).join(', ');
      return {
        title: title ?? 'Untitled photo',
        subtitle: where || 'No location set',
        media,
      };
    },
  },
});
