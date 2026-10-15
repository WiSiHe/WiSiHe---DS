import { BasketIcon } from '@sanity/icons/Basket';
import { defineField, defineType } from 'sanity';
import AIImageGenerator from '../components/AIImageGenerator';
import GenericAIGenerator from '../components/GenericAIGenerator';

export default defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Ingredient Name',
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
      components: {
        input: AIImageGenerator,
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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photo',
    },
  },
});
