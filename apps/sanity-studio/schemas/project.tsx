import {PackageIcon} from '@sanity/icons'
import {FaArrowRight, FaInfoCircle, FaWeibo} from 'react-icons/fa'
import {defineField, defineType} from 'sanity'
import ImageAltTextGenerator from '../components/ImageAltGenerator'
import {redirectType} from './redirectType'
import {seoType} from './seoType'
import {tag} from './tag'
import {socialType} from './socialType'

export default defineType({
  name: 'project',
  title: 'Project',
  icon: PackageIcon,
  type: 'document',
  groups: [
    {
      name: 'main',
      title: 'Main Info',
      icon: FaInfoCircle,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: FaWeibo,
    },
    {
      name: 'redirect',
      title: 'Redirect',
      icon: FaArrowRight,
    },
    {
      name: 'social',
      title: 'Social',
      icon: FaWeibo,
    },
  ],

  fields: [
    /* -------------------------
     * GROUP: main
     * ------------------------- */

    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'main',
      description: (
        <details>
          <summary>Why is this important?</summary>
          <p>The Googlebot is an indexer of...</p>
        </details>
      ),
      validation: (rule) => rule.required().error('Name is required'),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'main',
      initialValue: 'inProgress',
      description: 'Status of the project',
      options: {
        list: [
          {title: 'In Progress', value: 'inProgress'},
          {title: 'Completed', value: 'completed'},
          {title: 'On Hold', value: 'onHold'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Abandoned', value: 'abandoned'},
          {title: 'Unknown', value: 'unknown'},
          {title: 'Not Started', value: 'notStarted'},
          {title: 'Planned', value: 'planned'},
        ],
      },
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'main',
      description: 'Type of project',
      options: {
        list: [
          {title: 'Art', value: 'art'},
          {title: 'Design', value: 'design'},
          {title: 'Development', value: 'development'},
          {title: 'Game Development', value: 'gameDevelopment'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      description: 'URL-friendly identifier for this project',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'projectStart',
      title: 'Project Start',
      type: 'date',
      group: 'main',
      description: 'Start date of the project',
    }),

    defineField({
      name: 'projectEnd',
      title: 'Project End',
      type: 'date',
      group: 'main',
      description: 'End date of the project (only if completed, cancelled, or abandoned)',
      hidden: ({parent}) => {
        return (
          parent?.status !== 'completed' &&
          parent?.status !== 'cancelled' &&
          parent?.status !== 'abandoned'
        )
      },
      validation: (rule) =>
        rule.custom((end, context) => {
          // Cast parent
          const {projectStart, status} =
            (context.parent as {
              projectStart?: string
              status?: string
            }) ?? {}

          // If there's no end or no start, skip
          if (!end || !projectStart) return true

          // If status isn’t in a “finished” state, skip
          if (status !== 'completed' && status !== 'cancelled' && status !== 'abandoned') {
            return true
          }

          // Check that end >= projectStart
          return end >= projectStart ? true : 'End date must be on or after the start date'
        }),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      group: 'main',
      description: 'Rich text describing the project',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'main',
      description: 'Main image of the project',
      fields: [
        {
          name: 'alt',
          type: 'string',
          validation: (Rule) => Rule.required(),
          // group: ['AI', 'seo'],
          options: {
            isHighlighted: true,
            
          },
          components: {
            input: ImageAltTextGenerator,
          },
        },
      ],
      options: {
        hotspot: true,
        metadata: ['lqip'],
      },
    }),

    defineField({
      name: 'extraImages',
      title: 'Extra Images',
      type: 'array',
      group: 'main',
      description: 'Additional images for this project',
      of: [{type: 'image'}],
      // layout: 'grid' can still be used if desired
      options: {
        layout: 'grid',
      },
    }),

    defineField({
      name: 'connectedPaintings',
      title: 'Connected Paintings',
      type: 'array',
      group: 'main',
      description: 'References to any paintings associated with this project',
      of: [{type: 'reference', to: {type: 'painting'}}],
      // layout: 'grid' can still be used if desired
      options: {
        layout: 'grid',
      },
    }),

    defineField({
      name: 'connectedVideo',
      title: 'Connected Video',
      type: 'reference',
      group: 'main',
      to: [{type: 'video'}],
      description: 'A single video associated with this project',
    }),

    defineField({
      name: 'connectedPage',
      title: 'Connected Page',
      type: 'url', // if truly external
      group: 'main',
      description: 'An external page/URL connected to the project',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'main',

      of: [{type: 'reference', to: {type: tag.name}}],
      description: 'Tags for this project',
      options: {
        layout: 'tags', // or 'grid' if you prefer
      },
      validation: (rule) => rule.required(),
    }),
    defineField(seoType),
    defineField(redirectType),
    defineField(socialType),
  ],

  /* -----------------------------------
   * Custom Preview
   * ----------------------------------- */
  preview: {
    select: {
      title: 'name',
      media: 'image',
      status: 'status',
      desc: 'description',
      start: 'projectStart',
      end: 'projectEnd',
    },
    prepare({title, media, status, desc, start, end}) {
      // Optionally shorten SEO description
      const shortDesc = desc ? desc.substring(0, 50) : ''
      // Build a date range display if needed
      let dateRange = start ? `From ${start}` : ''
      if (end) {
        dateRange += dateRange ? ` → ${end}` : end
      }

      return {
        title: title || 'Untitled Project',
        media,
        subtitle:
          // If both status and dateRange exist
          status && dateRange
            ? `${status} | ${dateRange}`
            : // If only status is set
              status
              ? `${status} | ${shortDesc}...`
              : // Otherwise show date range or truncated desc
                dateRange || shortDesc,
      }
    },
  },
})
