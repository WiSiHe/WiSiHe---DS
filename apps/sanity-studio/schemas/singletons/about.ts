import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Story of WiSiHe',
      validation: r => r.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      initialValue: 'Henrik Sissener',
      validation: r => r.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description: 'Used in Person schema for SEO. 1–3 sentences about you.',
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      initialValue: 'Frontend Developer & Digital Artist',
    }),
    defineField({
      name: 'journeyItems',
      title: 'Journey Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Era Label',
              type: 'string',
              description: 'e.g. "The Beginning"',
            }),
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'e.g. "The Spark"',
            }),
            defineField({ name: 'content', title: 'Content', type: 'text', rows: 5 }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'year' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Lets create the Future together.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Start a Conversation',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Used in the hero and in Person schema sameAs field',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
});
