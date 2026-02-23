import { ImageIcon } from '@sanity/icons';
// import ImageAltTextGenerator from 'components/sanity/ImageAltTextGenerator'
// import ImageDescriptionGenerator from 'components/sanity/ImageDescriptionGenerator'
// import SEODescriptionGenerator from 'components/sanity/SEODescriptionGenerator'

import { FaWeibo } from 'react-icons/fa';

import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import ViewsArray from '../components/ViewsArray';

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
        metadata: ['lqip', 'palette'],
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: ['AI'],
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={` You are an AI expert at describing images, vividly describe this image, be as creative as you would like. Describe the style, colors, characters, what the motive might be and so on.

Requirements:
- 150-300 words maximum
- Use present tense
- Be objective and descriptive
- Write in clear, flowing paragraphs
- Focus on visual elements and artistic choices`}
            imageField='image'
            rows={6}
            placeholder='Description will appear here...'
          />
        ),
      },
      description: 'Description of the painting',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: ['seo', 'AI'],
      description: 'This description will be used in the meta description for SEO purposes',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt='You are an AI SEO expert writer. Re-write the following text into a good SEO description in 122 characters or less, it should never exceed 122: {description}'
            fieldDependencies={{
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
      name: 'views',
      title: 'Views',
      type: 'array',
      group: 'social',
      options: {
        layout: 'list',
      },
      components: {
        input: ViewsArray,
      },
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'viewerId',
              title: 'Viewer ID',
              type: 'string', // You might want to consider a more robust ID system if necessary
              description: 'ID of the viewer',
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
              description: 'Time when the view was recorded',
            },
            {
              name: 'location',
              title: 'Location',
              type: 'string',
              description: 'Location of the viewer',
            },
          ],
          preview: {
            select: {
              viewerId: 'viewerId',
              timestamp: 'timestamp',
            },
            prepare({ viewerId, timestamp }: { viewerId: string; timestamp: string }) {
              return {
                title: viewerId,
                subtitle: new Date(timestamp).toLocaleString(),
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
    }),
    defineField({
      name: 'redbubbleUrl',
      title: 'Redbubble URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'society6Url',
      title: 'Society6 URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'artstationUrl',
      title: 'ArtStation URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'inPrintUrl',
      title: 'In Print',
      type: 'url',
      group: 'social',
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter URL',
      type: 'url',
      group: 'social',
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
      description: 'Tags for the painting',
      options: {
        layout: 'list',
      },
      validation: rule => rule.required(),
    }),
  ],
});
