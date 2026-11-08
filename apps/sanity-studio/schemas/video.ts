import { DocumentVideoIcon } from '@sanity/icons/DocumentVideo';
import { defineField, defineType } from 'sanity';

// import tagType from './tag'
// import VideoDescriptionGenerator from 'components/sanity/VideoDescriptionGenerator'

export default defineType({
  name: 'video',
  title: 'Video',
  icon: DocumentVideoIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the video',
      validation: rule =>
        rule.required().max(50).min(5).warning('Title should be between 5 and 50 characters'),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'The slug is used to generate the URL of the video',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      //   components: {
      //     input: VideoDescriptionGenerator,
      //   },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
      description: 'The URL of the video',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'uploadDate',
      title: 'Video publication date',
      type: 'datetime',
      description:
        'When the video was first published on its hosting platform. Search markup uses a temporary placeholder until this is set.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Whether the video is featured',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'The thumbnail of the video',
      fields: [
        {
          name: 'alt',
          type: 'string',
          validation: Rule => Rule.required(),
        },
      ],
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette'],
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'linkedPainting',
      title: 'Linked Painting',
      type: 'reference',
      to: [{ type: 'painting' }],
      description: 'The painting that is linked to this video',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      description: 'Tags for the video',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Optional overrides for search and social previews.',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'thumbnail',
    },
  },
});
