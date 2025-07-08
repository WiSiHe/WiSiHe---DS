import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      description: 'If provided, this will override the title field',
      type: 'string',
      validation: (rule) =>
        rule.min(50).max(60).warning('SEO title should be between 50 and 60 characters'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      description: 'If provided, this will override the description field',
      validation: (rule) =>
        rule.min(50).max(160).warning('SEO description should be between 50 and 160 characters'),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      description: 'If provided, this will override the image field',
    }),
    defineField({
      name: 'noIndex',
      type: 'boolean',
      description: 'If checked, search engines will not index this page',
    }),
  ],
})
