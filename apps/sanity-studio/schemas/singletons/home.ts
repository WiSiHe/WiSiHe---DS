import { HomeIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'projects', title: 'Projects' },
    { name: 'paintings', title: 'Paintings' },
    { name: 'aboutTeaser', title: 'About teaser' },
    { name: 'videosTeaser', title: 'Videos teaser' },
    { name: 'shopTeaser', title: 'Shop teaser' },
    { name: 'contactCta', title: 'Contact CTA' },
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      group: 'hero',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'overview',
      description:
        'Shown in the home page hero below your name, and used for the home page meta description.',
      title: 'Home intro',
      type: 'array',
      group: 'hero',
      of: [
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Strong', value: 'strong' },
            ],
          },
          styles: [],
          type: 'block',
        }),
      ],
      validation: rule => rule.max(155).required(),
    }),
    defineField({
      name: 'projectsTitle',
      title: 'Projects title',
      description:
        'Heading above featured projects on the home page. Also used for the projects page browser title when set.',
      type: 'string',
      group: 'projects',
    }),
    defineField({
      name: 'projectsDescription',
      title: 'Projects description',
      description: 'Intro copy above the featured projects section on the home page.',
      type: 'array',
      group: 'projects',
      of: [
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'Url' }],
              },
              {
                name: 'internalLink',
                title: 'Internal link',
                type: 'object',
                fields: [{ name: 'reference', type: 'string', title: 'Reference' }],
              },
            ],
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Strong', value: 'strong' },
            ],
          },
          styles: [],
          type: 'block',
        }),
      ],
      validation: rule => rule.max(155).required(),
    }),
    defineField({
      name: 'projectsListingDescription',
      title: 'Projects listing description',
      description:
        'Intro copy on the /projects archive page. Also used for the projects page meta description when set.',
      type: 'blockContent',
      group: 'projects',
      validation: rule => rule.max(155).required(),
    }),
    defineField({
      name: 'showcaseProjects',
      title: 'Showcase projects',
      description: 'These are the projects that will appear first on your landing page.',
      type: 'array',
      group: 'projects',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
    }),
    defineField({
      name: 'paintingsTitle',
      title: 'Paintings title',
      description:
        'Browser title for the paintings gallery page (falls back to “Digital Art Gallery”).',
      type: 'string',
      group: 'paintings',
    }),
    defineField({
      name: 'paintingsDescription',
      title: 'Paintings description',
      description:
        'Intro copy on the home page paintings section. Also used for the paintings page meta description when set.',
      type: 'blockContent',
      group: 'paintings',
      validation: rule => rule.max(155).required(),
    }),
    defineField({
      name: 'showcasePaintings',
      title: 'Showcase paintings',
      description: 'These are the paintings that will appear first on your landing page.',
      type: 'array',
      group: 'paintings',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'painting' }],
        }),
      ],
    }),

    // ── About teaser ──────────────────────────────────────────────────────────
    defineField({
      name: 'aboutTeaserEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: '// About',
    }),
    defineField({
      name: 'aboutTeaserTitle',
      title: 'Heading',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: 'Code, canvas, and curiosity',
    }),
    defineField({
      name: 'aboutTeaserDescription',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'aboutTeaser',
      description:
        'Main paragraph for the about teaser. Leave empty to auto-build from the About page bio.',
    }),
    defineField({
      name: 'aboutTeaserPrimaryLabel',
      title: 'Primary button label',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: 'My story',
    }),
    defineField({
      name: 'aboutTeaserSecondaryLabel',
      title: 'Secondary button label',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'aboutTeaserJourneyEyebrow',
      title: 'Journey card eyebrow',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: 'Life journey',
    }),
    defineField({
      name: 'aboutTeaserJourneyLinkLabel',
      title: 'Journey card link label',
      type: 'string',
      group: 'aboutTeaser',
      initialValue: 'View full journey',
    }),

    // ── Videos teaser ─────────────────────────────────────────────────────────
    defineField({
      name: 'videosTeaser',
      title: 'Videos section copy',
      type: 'homeSectionIntro',
      group: 'videosTeaser',
      initialValue: {
        eyebrow: '// Motion',
        title: 'Process & playback',
        description:
          'Timelapses, animation tests, and game dev clips — a look behind the still frames.',
        linkLabel: 'All videos',
      },
    }),

    // ── Shop teaser ───────────────────────────────────────────────────────────
    defineField({
      name: 'shopTeaser',
      title: 'Shop section copy',
      type: 'homeSectionIntro',
      group: 'shopTeaser',
      initialValue: {
        eyebrow: '// Shop',
        title: 'Available as prints',
        description:
          'Selected works available through print-on-demand — take a piece of the gallery home.',
        linkLabel: 'Browse gallery',
      },
    }),

    // ── Contact CTA ───────────────────────────────────────────────────────────
    defineField({
      name: 'contactCtaEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'contactCta',
      initialValue: '// Available for work',
    }),
    defineField({
      name: 'contactCtaTitle',
      title: 'Heading',
      type: 'string',
      group: 'contactCta',
      description: 'Leave empty to use the CTA heading from the About page.',
    }),
    defineField({
      name: 'contactCtaDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'contactCta',
      initialValue:
        'Open to freelance frontend work, design-engineering collaborations, and creative commissions.',
    }),
    defineField({
      name: 'contactCtaPrimaryLabel',
      title: 'Primary button label',
      type: 'string',
      group: 'contactCta',
      description: 'Leave empty to use the CTA button text from the About page.',
    }),
    defineField({
      name: 'contactCtaPrimaryUrl',
      title: 'Primary button URL',
      type: 'string',
      group: 'contactCta',
      description: 'Leave empty to use the CTA URL from the About page.',
    }),
    defineField({
      name: 'contactCtaSecondaryLabel',
      title: 'Secondary button label',
      type: 'string',
      group: 'contactCta',
      initialValue: 'View projects',
    }),
    defineField({
      name: 'contactCtaSecondaryUrl',
      title: 'Secondary button URL',
      type: 'string',
      group: 'contactCta',
      initialValue: '/projects',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title = '' }: { title: string }) {
      return {
        title: title || 'Home',
        subtitle: 'Home',
      };
    },
  },
});
