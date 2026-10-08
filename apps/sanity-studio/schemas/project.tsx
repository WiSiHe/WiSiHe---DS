/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { PackageIcon } from '@sanity/icons/Package';
import { FaArrowRight, FaInfoCircle, FaWeibo } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';
import ImageAltTextGenerator from '../components/ImageAltGenerator';
import { redirectType } from './redirectType';
import { seoType } from './seoType';
import { socialType } from './socialType';
import { tag } from './tag';
import { PROJECT_TAG_GUIDE, validateContentTags } from './tagGuidance';
import { PROJECT_SUMMARY_MAX_CHARS, portableTextCharCount } from './validators/portableTextLength';

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
      title: 'Title',
      type: 'string',
      group: 'main',
      description:
        'Primary project name shown on the site (e.g. "Transport Optimisation Dashboard"). Use Title Case — not ALL CAPS.',
      validation: rule => rule.required().error('Title is required'),
    }),

    defineField({
      name: 'client',
      title: 'Client / context',
      type: 'string',
      group: 'main',
      description:
        'Optional label for the client, employer, or event (e.g. "Bama", "Hackathon"). Shown above the title on project pages.',
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
          { title: 'In Progress', value: 'inProgress' },
          { title: 'Completed', value: 'completed' },
          { title: 'On Hold', value: 'onHold' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Abandoned', value: 'abandoned' },
          { title: 'Unknown', value: 'unknown' },
          { title: 'Not Started', value: 'notStarted' },
          { title: 'Planned', value: 'planned' },
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
          { title: 'Design', value: 'design' },
          { title: 'Development', value: 'development' },
          { title: 'Game Development', value: 'gameDevelopment' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: rule => rule.required(),
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
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'excludeFromOngoingSpotlight',
      title: 'Hide from ongoing spotlight',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description:
        'List this project in the past projects grid instead of the large ongoing hero on /projects. Use for long-running personal work that is still in progress. Detail page status is unchanged.',
      hidden: ({ parent }) => {
        const status = parent?.status as string | undefined;
        return !['inProgress', 'onHold', 'notStarted', 'planned'].includes(status ?? '');
      },
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
      hidden: ({ parent }) => {
        return (
          parent?.status !== 'completed' &&
          parent?.status !== 'cancelled' &&
          parent?.status !== 'abandoned'
        );
      },
      validation: rule =>
        rule.custom((end, context) => {
          // Cast parent
          const { projectStart, status } =
            (context.parent as {
              projectStart?: string;
              status?: string;
            }) ?? {};

          // If there's no end or no start, skip
          if (!end || !projectStart) return true;

          // If status isn’t in a “finished” state, skip
          if (status !== 'completed' && status !== 'cancelled' && status !== 'abandoned') {
            return true;
          }

          // Check that end >= projectStart
          return end >= projectStart ? true : 'End date must be on or after the start date';
        }),
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'blockContentMinimal',
      group: 'main',
      description:
        'Short intro shown in the project sidebar (2–3 paragraphs, ~400 characters). The full case study lives in Content.',
      validation: rule =>
        rule.custom(
          (
            blocks:
              | Array<{ _type?: string; children?: Array<{ text?: string | null }> }>
              | undefined,
          ) => {
            const count = portableTextCharCount(blocks);
            if (count === 0) return true;
            if (count > PROJECT_SUMMARY_MAX_CHARS) {
              return `Keep the summary under ${PROJECT_SUMMARY_MAX_CHARS} characters (currently ${count}).`;
            }
            return true;
          },
        ),
    }),

    defineField({
      name: 'content',
      title: 'Case study',
      type: 'blockContent',
      group: 'main',
      description: 'Full case study — rendered below the project overview on the detail page.',
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
          validation: Rule => Rule.required(),
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
      of: [{ type: 'image' }],
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
      of: [{ type: 'reference', to: { type: 'painting' } }],
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
      to: [{ type: 'video' }],
      description: 'A single video associated with this project',
    }),

    defineField({
      name: 'connectedPage',
      title: 'Connected Page',
      type: 'url', // if truly external
      group: 'main',
      description:
        'Public URL for the live project. Shown as an external link on the project page (not embedded).',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'main',

      of: [{ type: 'reference', to: { type: tag.name } }],
      description: PROJECT_TAG_GUIDE,
      options: {
        layout: 'tags', // or 'grid' if you prefer
      },
      validation: rule => validateContentTags(rule, 3),
    }),
    defineField({
      name: 'viewsCount',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      group: 'main',
      description: 'Tracked on the site — do not edit manually',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'array',
      readOnly: true,
      group: 'main',
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
      client: 'client',
      media: 'image',
      status: 'status',
      desc: 'seo.description',
      start: 'projectStart',
      end: 'projectEnd',
    },
    prepare({ title, client, media, status, desc, start, end }) {
      const shortDesc = typeof desc === 'string' ? desc.substring(0, 50) : '';
      const displayTitle =
        typeof client === 'string' && client.trim()
          ? `${client.trim()} — ${typeof title === 'string' ? title : 'Untitled Project'}`
          : (typeof title === 'string' ? title : '') || 'Untitled Project';
      // Build a date range display if needed
      let dateRange = start ? `From ${start}` : '';
      if (end) {
        dateRange += dateRange ? ` → ${end}` : end;
      }

      return {
        title: displayTitle,
        media: media,
        subtitle:
          // If both status and dateRange exist
          status && dateRange
            ? `${status} | ${dateRange}`
            : // If only status is set
              status
              ? `${status} | ${shortDesc}...`
              : // Otherwise show date range or truncated desc
                dateRange || shortDesc,
      };
    },
  },
});
