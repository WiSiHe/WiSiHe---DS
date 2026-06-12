import { defineField, defineType } from 'sanity';

/** Eyebrow, heading, and body copy for a home page section. */
export default defineType({
  name: 'homeSectionIntro',
  title: 'Section intro',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the heading (e.g. // About).',
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link button label',
      type: 'string',
      description: 'Optional button beside the section header (e.g. “All videos”).',
    }),
  ],
});
