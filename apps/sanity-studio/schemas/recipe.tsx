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
      name: 'ingredientCategories',
      title: 'Ingredient Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'categoryName',
              title: 'Category Name',
              type: 'string',
              description: 'e.g., "Wet Ingredients", "Dry Ingredients"',
              validation: Rule => Rule.required(),
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
                      name: 'photo',
                      title: 'Ingredient Photo',
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
                      name: 'amount',
                      title: 'Amount',
                      type: 'string',
                      description: 'e.g., "3", "1.5", "2 ½"',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'unit',
                      title: 'Unit',
                      type: 'string',
                      description: 'e.g., "g", "ml", "cups", "large eggs"',
                      validation: Rule => Rule.required(),
                    }),
                    defineField({
                      name: 'isDiscrete',
                      title: 'Discrete Item',
                      type: 'boolean',
                      description:
                        'Check if this is a discrete item (eggs, apples, etc.) that cannot be easily divided',
                      initialValue: false,
                    }),
                    defineField({
                      name: 'notes',
                      title: 'Notes',
                      type: 'string',
                      description: 'Optional additional information',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              description: 'e.g., "Combine the Wet Ingredients"',
            }),
            defineField({
              name: 'content',
              title: 'Step Content',
              type: 'blockContent',
              description:
                'Use {{ingredient_name}} to reference ingredients dynamically. Example: "Whisk together {{eggs}} and {{sugar}} until fluffy"',
              validation: Rule => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tips',
      title: 'Tips & Tricks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Tip Title',
              type: 'string',
              description: 'e.g., "Batter Consistency", "Flavor Customization"',
            }),
            defineField({
              name: 'content',
              title: 'Tip Content',
              type: 'text',
              rows: 3,
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional emoji or icon (e.g., "💡", "🔥")',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'cookingTime',
      title: 'Cooking Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'prepTime',
      title: 'Prep Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'totalTime',
      title: 'Total Time (minutes)',
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
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
  ],
});
