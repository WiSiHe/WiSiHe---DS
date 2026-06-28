import { FaWeibo } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';
import AIImageGenerator from '../components/AIImageGenerator';
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
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
      description: 'Short summary for search snippets and cards (under 200 characters).',
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
      name: 'story',
      title: 'About this dish',
      type: 'blockContentMinimal',
      group: 'main',
      description:
        'Optional longer intro — origin, personal notes, or serving context. Shown on the recipe page and helps search/AI understand the dish.',
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
          preview: {
            select: {
              title: 'categoryName',
              ingredients: 'ingredients',
            },
            prepare({ title, ingredients }: { title?: string; ingredients?: unknown[] }) {
              const count = ingredients?.length ?? 0;
              return {
                title: title || 'Untitled category',
                subtitle: `${count} ingredient${count === 1 ? '' : 's'}`,
              };
            },
          },
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
                  preview: {
                    select: {
                      title: 'ingredient.name',
                      amount: 'amount',
                      unit: 'unit',
                      media: 'ingredient.photo',
                    },
                    prepare({
                      title,
                      amount,
                      unit,
                      media,
                    }: {
                      title?: string;
                      amount?: string;
                      unit?: string;
                      media?: unknown;
                    }) {
                      const quantity = [amount, unit].filter(Boolean).join(' ');
                      return {
                        title: title || 'Select ingredient',
                        subtitle: quantity || 'No amount set',
                        media,
                      };
                    },
                  },
                  fields: [
                    defineField({
                      name: 'ingredient',
                      title: 'Ingredient',
                      type: 'reference',
                      to: [{ type: 'ingredient' }],
                      validation: Rule => Rule.required(),
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
      name: 'nutrition',
      title: 'Nutrition (per serving)',
      type: 'recipeNutrition',
      group: 'ingredients',
      description:
        'Calories and macros per serving. Open this block and use “Estimate with AI”, or enter values manually.',
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
      name: 'recipeCategory',
      title: 'Recipe Category',
      type: 'string',
      description: 'e.g. Dessert, Dinner, Main course, Salad',
      group: 'metadata',
    }),
    defineField({
      name: 'recipeCuisine',
      title: 'Recipe Cuisine',
      type: 'string',
      description: 'e.g. Italian, Mexican, French, Nordic',
      group: 'metadata',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'metadata',
    }),
    defineField({
      name: 'viewsCount',
      title: 'Views',
      type: 'number',
      group: 'metadata',
      initialValue: 0,
      readOnly: true,
      description: 'Tracked automatically — do not edit manually',
    }),
    defineField({
      name: 'averageRating',
      title: 'Average rating',
      type: 'number',
      group: 'metadata',
      readOnly: true,
      description: 'Computed from visitor star ratings',
    }),
    defineField({
      name: 'ratingCount',
      title: 'Rating count',
      type: 'number',
      group: 'metadata',
      readOnly: true,
      description: 'Number of visitor star ratings',
    }),
    defineField({
      name: 'ratings',
      title: 'Ratings',
      type: 'array',
      group: 'metadata',
      readOnly: true,
      description: 'Visitor star ratings — do not edit manually',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'raterId', type: 'string', title: 'Rater ID' },
            {
              name: 'value',
              type: 'number',
              title: 'Stars',
              validation: Rule => Rule.min(1).max(5).integer(),
            },
            { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
          ],
        },
      ],
    }),
    defineField(seoType),
  ],
});
