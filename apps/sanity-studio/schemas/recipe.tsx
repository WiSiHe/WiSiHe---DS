import { FaWeibo } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { seoType } from './seoType';

export default defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  groups: [
    {
      name: 'main',
      title: 'Main Info',
      default: true,
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
    },
    {
      name: 'instructions',
      title: 'Instructions',
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: FaWeibo,
    },
    {
      name: 'metadata',
      title: 'Metadata',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'main',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
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
      group: 'main',
      rows: 3,
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt='Write a compelling recipe description that highlights what makes this dish special. Include key flavors, textures, and what diners can expect. Make it appetizing and under 200 characters.'
            characterLimit={200}
            rows={3}
            placeholder='Enter or generate a recipe description...'
          />
        ),
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'main',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: Rule => Rule.required(),
          components: {
            input: props => (
              <GenericAIGenerator
                {...props}
                prompt='Write alt text for this recipe image. Describe the food, presentation, colors, and any notable visual elements. Focus on accessibility and make it descriptive for screen readers. Keep it concise and under 125 characters.'
                imageField='mainImage'
                characterLimit={122}
                rows={2}
                placeholder='Enter or generate alt text for the main image...'
              />
            ),
          },
        }),
      ],
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      group: 'main',
      of: [
        {
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
              components: {
                input: props => (
                  <GenericAIGenerator
                    {...props}
                    prompt='Write alt text for this recipe image. Describe the food, presentation, colors, and visual elements. Focus on accessibility for screen readers. Keep it under 120 characters.'
                    imageField='.'
                    characterLimit={120}
                    rows={2}
                    placeholder='Enter or generate alt text for image...'
                  />
                ),
              },
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
              components: {
                input: props => (
                  <GenericAIGenerator
                    {...props}
                    prompt="Write an engaging caption for this recipe image. Explain what's shown and why it's relevant to the recipe. Keep it conversational, informative, and under 80 characters."
                    imageField='.'
                    characterLimit={80}
                    rows={2}
                    placeholder='Enter or generate a caption...'
                  />
                ),
              },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ingredientCategories',
      title: 'Ingredient Categories',
      type: 'array',
      group: 'ingredients',
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
                          components: {
                            input: props => (
                              <GenericAIGenerator
                                {...props}
                                prompt='Write alt text for this ingredient image. Include the ingredient name, appearance, color, texture, and distinctive features. Keep it concise and accessible for screen readers.'
                                imageField='photo'
                                characterLimit={100}
                                rows={2}
                                placeholder='Enter or generate alt text for ingredient...'
                              />
                            ),
                          },
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
      group: 'instructions',
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
      group: 'instructions',
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
              components: {
                input: props => (
                  <GenericAIGenerator
                    {...props}
                    prompt="Write a practical cooking tip for '{title}'. Focus on techniques, timing, or ingredient advice that will help home cooks achieve better results. Be specific and actionable."
                    fieldDependencies={{
                      title: 'title',
                    }}
                    characterLimit={300}
                    rows={3}
                    placeholder='Enter or generate cooking tip content...'
                  />
                ),
              },
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
      group: 'metadata',
    }),
    defineField({
      name: 'prepTime',
      title: 'Prep Time (minutes)',
      type: 'number',
      group: 'metadata',
    }),
    defineField({
      name: 'totalTime',
      title: 'Total Time (minutes)',
      type: 'number',
      group: 'metadata',
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'number',
      group: 'metadata',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'metadata',
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
      group: 'metadata',
      of: [{ type: 'reference', to: { type: 'tag' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'metadata',
    }),
    defineField(seoType),
  ],
});
