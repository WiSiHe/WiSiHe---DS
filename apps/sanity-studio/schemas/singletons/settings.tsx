import { CogIcon } from '@sanity/icons/Cog';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    // Website Title
    defineField({
      name: 'title',
      description:
        'The title of your website. Appears in browser tabs and as the primary title for search engines.',
      title: 'Website Title',
      type: 'string',
      validation: rule =>
        rule
          .required()
          .max(60)
          .warning('Titles longer than 60 characters may be truncated in search results.'),
    }),

    // Website Description
    defineField({
      name: 'description',
      description:
        'Used for the meta description tag. Essential for SEO and appears in search engine results.',
      title: 'Meta Description',
      type: 'text',
      validation: rule =>
        rule
          .required()
          .max(160)
          .warning('Descriptions longer than 160 characters may be truncated in search results.'),
    }),

    // Open Graph Image
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description:
        'Used in social sharing and search results. Should be 1200x630 pixels for optimal results.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          description:
            'Describes the image for accessibility and SEO. This is crucial for users with visual impairments.',
          title: 'Alt Text',
          type: 'string',
          validation: rule => {
            return rule.custom((alt, context) => {
              // biome-ignore lint/suspicious/noExplicitAny: Sanity context type is not fully typed
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Alt text is required when an Open Graph image is provided.';
              }
              return true;
            });
          },
        }),
      ],
    }),

    // Twitter Metadata
    defineField({
      name: 'twitter',
      title: 'Twitter Metadata',
      type: 'object',
      fields: [
        defineField({
          name: 'twitterCard',
          title: 'Twitter Card Type',
          type: 'string',
          description: 'The card type, e.g., "summary" or "summary_large_image".',
          options: {
            list: [
              { title: 'Summary', value: 'summary' },
              { title: 'Summary with Large Image', value: 'summary_large_image' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'twitterUsername',
          title: 'Twitter Username',
          type: 'string',
          description: 'Your Twitter handle (e.g., @yourusername).',
        }),
        defineField({
          name: 'twitterImage',
          title: 'Twitter Image',
          type: 'image',
          description: 'Specific image for Twitter cards, should be at least 1200x628 pixels.',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),

    // Favicon
    // defineField({
    //   name: 'favicon',
    //   title: 'Favicon',
    //   type: 'image',
    //   description: 'The small icon displayed in the browser tab. Typically 32x32 or 48x48 pixels.',
    //   options: {
    //     hotspot: false,
    //   },
    // }),

    // SEO Keywords
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      description:
        'A list of keywords to improve search engine visibility. Separate keywords with commas.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: rule =>
        rule
          .unique()
          .max(15)
          .warning('Using more than 15 keywords might dilute the SEO effectiveness.'),
    }),

    // Metadata Base URL
    defineField({
      name: 'metadataBase',
      type: 'url',
      title: 'Metadata Base URL',
      description:
        'Base URL for generating canonical and structured metadata. Typically your website’s domain.',
      validation: rule =>
        rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    // JSON-LD Structured Data
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      description:
        'Custom JSON-LD for rich search engine snippets. Use this to define advanced structured data for SEO.',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          description: 'The type of structured data (e.g., "Website", "Organization", "Person").',
          validation: rule => rule.required(),
        }),
        defineField({
          name: 'data',
          title: 'JSON-LD Data',
          type: 'text',
          description: 'Paste valid JSON-LD code here. Use a generator or write manually.',
          validation: rule => {
            return rule.custom(data => {
              try {
                JSON.parse(data);
                return true;
              } catch {
                return 'Invalid JSON format.';
              }
            });
          },
        }),
      ],
    }),

    // Social Media Links
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      description: 'Links to your social media profiles, used in the footer and metadata.',
      type: 'array',
      of: [
        defineField({
          name: 'socialLink',
          title: 'Social Link',
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              validation: rule => rule.required(),
            },
            { name: 'url', title: 'URL', type: 'url', validation: rule => rule.required() },
          ],
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Settings',
      };
    },
  },
});
