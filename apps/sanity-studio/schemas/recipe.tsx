import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
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
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'ingredient',
              title: 'Ingredient',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'amount',
              title: 'Amount',
              type: 'string',
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'blockContent',
    }),
    defineField({
      name: 'cookingTime',
      title: 'Cooking Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'number',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Medium', value: 'medium' },
          { title: 'Hard', value: 'hard' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    // defineField({
    //   name: 'seo',
    //   title: 'SEO',
    //   type: 'seoType',
    // }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
});
