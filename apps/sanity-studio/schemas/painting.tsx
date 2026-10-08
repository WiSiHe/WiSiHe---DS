import { ImageIcon } from '@sanity/icons/Image';
// import ImageAltTextGenerator from 'components/sanity/ImageAltTextGenerator'
// import ImageDescriptionGenerator from 'components/sanity/ImageDescriptionGenerator'
// import SEODescriptionGenerator from 'components/sanity/SEODescriptionGenerator'

import { FaWeibo } from 'react-icons/fa';

import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import {
  PAINTING_DESCRIPTION_AI_PROMPT,
  PAINTING_DESCRIPTION_GUIDE,
  PAINTING_SEO_FROM_DESCRIPTION_PROMPT,
  validatePaintingDescription,
} from './descriptionGuidance';
import { PAINTING_TAG_GUIDE, validateContentTags } from './tagGuidance';

export default defineType({
  name: 'painting',
  title: 'Painting',
  icon: ImageIcon,
  type: 'document',
  groups: [
    {
      name: 'seo',
      title: 'SEO',
      default: false,
      icon: FaWeibo,
    },
    {
      name: 'media',
      title: 'Media',
      default: false,
      icon: ImageIcon,
    },
    {
      name: 'AI',
      title: 'AI',
      default: false,
      icon: ImageIcon,
    },
    {
      name: 'social',
      title: 'Social',
      default: false,
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'seo',
      description: 'Title of the painting',
      validation: rule =>
        rule.required().max(50).min(5).warning('Title should be between 5 and 50 characters'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      description: 'The slug is used to generate the URL of the painting',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Primary Image',
      type: 'image',
      group: ['media', 'AI'],
      description: 'The main image of the painting',
      fields: [
        {
          name: 'alt',
          type: 'string',
          validation: Rule => Rule.required(),
          group: ['AI', 'seo'],
          components: {
            input: props => (
              <GenericAIGenerator
                {...props}
                prompt='You are an AI SEO expert writer, write a good alt text for this image in 96 characters or less.'
                imageField='image'
                characterLimit={92}
                buttonText='Generate Alt Text'
                placeholder='Alt text here...'
              />
            ),
          },
        },
      ],
      options: {
        hotspot: true,
        metadata: ['lqip', 'blurhash', 'palette'],
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Gallery label',
      type: 'text',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PAINTING_DESCRIPTION_AI_PROMPT}
            imageField='image'
            characterLimit={240}
            rows={4}
            placeholder='A figure reclines in a bath, rendered in loose warm strokes. Everyday stillness, unhurried and intimate.'
          />
        ),
      },
      description: PAINTING_DESCRIPTION_GUIDE,
      validation: validatePaintingDescription,
    }),
    defineField({
      name: 'seo',
      title: 'SEO overrides',
      type: 'seo',
      group: 'seo',
      description:
        'Optional overrides for search and social previews. Falls back to title, image, and SEO description below.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (legacy)',
      type: 'text',
      group: ['seo', 'AI'],
      description:
        'Used when SEO overrides → description is empty. Prefer the SEO overrides field for new content.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PAINTING_SEO_FROM_DESCRIPTION_PROMPT}
            fieldDependencies={{
              title: 'title',
              description: 'description',
            }}
            characterLimit={122}
            rows={3}
            placeholder='Enter your description here...'
          />
        ),
      },
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'title',
              type: 'string',
              description: 'Title of the image',
              validation: Rule => Rule.required(),
            },
            {
              name: 'alt',
              type: 'string',
              description: 'Alt text for the image',
              validation: Rule => Rule.required(),
              group: ['AI', 'seo'],
              components: {
                input: props => (
                  <GenericAIGenerator
                    {...props}
                    prompt='You are an AI SEO expert writer, write a good alt text for this image in 96 characters or less. '
                    imageField='image'
                    characterLimit={92}
                    buttonText='Generate Alt Text'
                    placeholder='Alt text here...'
                  />
                ),
              },
            },
          ],
          options: { hotspot: true },
        },
      ],
      description: 'Additional images of the painting',
      //   validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'video',
      title: 'Video',
      type: 'url',
      group: 'media',
      description: 'YouTube or Vimeo URL',
      // validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      initialValue: 'square',
      description: 'Aspect ratio of the painting',
      validation: rule => rule.required(),
      options: {
        list: ['square', 'landscape', 'portrait'],
      },
    }),
    defineField({
      name: 'viewsCount',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Tracked via PostHog — do not edit manually',
    }),
    defineField({
      name: 'isNSFW',
      title: 'NSFW',
      type: 'boolean',
      initialValue: false,
      description: 'Mark if this painting contains mature/sensitive content',
    }),
    defineField({
      name: 'isForSale',
      title: 'For Sale',
      type: 'boolean',
      initialValue: false,
      description: 'Is this painting available for purchase (e.g. on Redbubble)?',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this painting in featured/highlights sections',
    }),
    defineField({
      name: 'isFanArt',
      title: 'Fan Art',
      type: 'boolean',
      initialValue: false,
      description: 'Is this based on an existing IP, character, or franchise?',
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
      initialValue: 'Digital (Procreate)',
      description: 'The medium used to create this painting',
      options: {
        list: [
          { title: 'Digital (Procreate)', value: 'Digital (Procreate)' },
          { title: 'Digital (Photoshop)', value: 'Digital (Photoshop)' },
          { title: 'Digital (Other)', value: 'Digital (Other)' },
          { title: 'Oil on canvas', value: 'Oil on canvas' },
          { title: 'Watercolour', value: 'Watercolour' },
          { title: 'Pencil / Ink', value: 'Pencil / Ink' },
        ],
      },
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'array',
      readOnly: true,
      description: 'Toggled by visitors — do not edit manually',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'likerId', type: 'string', title: 'Liker ID' },
            { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
          ],
        },
      ],
    }),
    defineField({
      name: 'redbubbleUrl',
      title: 'Redbubble URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'gelatoUrl',
      title: 'Gelato URL',
      type: 'url',
      group: 'social',
      description: 'Link to print-on-demand product on Gelato',
    }),
    defineField({
      name: 'paintedAt',
      title: 'Painted At',
      type: 'datetime',
      description: 'Date when the painting was painted',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'tagsV2',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      description: PAINTING_TAG_GUIDE,
      options: {
        layout: 'list',
      },
      validation: rule => validateContentTags(rule, 2),
    }),
  ],
});
