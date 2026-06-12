import { defineField, defineType } from 'sanity';

const LOCATION_TYPES = [
  { title: 'Born here', value: 'birthplace' },
  { title: 'Lived here', value: 'lived' },
  { title: 'Studied here', value: 'studied' },
  { title: 'Worked here', value: 'worked' },
  { title: 'Adventure / trip', value: 'trip' },
  { title: 'Other', value: 'other' },
] as const;

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Story of WiSiHe',
      validation: r => r.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      initialValue: 'Henrik Sissener',
      description: 'Full name — used in Person schema and page headings.',
      validation: r => r.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description: 'Used in Person schema for SEO. 1–3 sentences about you.',
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      initialValue: 'Frontend Developer & Digital Artist',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: rule =>
        rule.max(60).warning('SEO titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      validation: rule =>
        rule
          .max(160)
          .warning('SEO descriptions over 160 characters may be truncated in search results'),
    }),
    defineField({
      name: 'knowsAbout',
      title: 'Expertise (knowsAbout)',
      type: 'array',
      description: 'Topics for Person schema — skills, tools, and creative disciplines.',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'journeyItems',
      title: 'Life Journey (map story)',
      description:
        'Scroll chapters for the about page. Add coordinates so Mapbox flies to each place as users scroll.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Era Label',
              type: 'string',
              description: 'e.g. "1990s" or "The Beginning"',
            }),
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'e.g. "Roots in the south"',
            }),
            defineField({ name: 'content', title: 'Content', type: 'text', rows: 5 }),
            defineField({
              name: 'placeName',
              title: 'Place name',
              type: 'string',
              description: 'Displayed on the map marker and in structured data.',
            }),
            defineField({
              name: 'locationType',
              title: 'Location type',
              type: 'string',
              options: { list: LOCATION_TYPES.map(t => ({ title: t.title, value: t.value })) },
            }),
            defineField({
              name: 'coordinates',
              title: 'Map coordinates',
              type: 'geopoint',
              description: 'Click the map to set lat/lng. Required for the scrolly map.',
            }),
            defineField({
              name: 'mapZoom',
              title: 'Map zoom',
              type: 'number',
              initialValue: 10,
              validation: rule => rule.min(1).max(18),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'placeName',
              year: 'year',
              locationType: 'locationType',
            },
            prepare({ title, subtitle, year, locationType }) {
              const typeLabel =
                LOCATION_TYPES.find(t => t.value === locationType)?.title ?? locationType;
              return {
                title: title ?? 'Journey chapter',
                subtitle: [year, subtitle, typeLabel].filter(Boolean).join(' · '),
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'visitedCountries',
      title: 'Countries visited',
      description:
        'Travel destinations highlighted as full countries on the map. Set Country code (ISO) for reliable map fills. Tag photography with the same country name to show photos in each card.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'country',
              title: 'Country',
              type: 'string',
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'countryCode',
              title: 'Country code (ISO)',
              type: 'string',
              description:
                'Two-letter ISO code for map highlighting — e.g. FR, DE, NO. Auto-guessed when empty.',
              validation: rule =>
                rule.custom(value => {
                  if (!value) return true;
                  return /^[A-Za-z]{2}$/.test(value)
                    ? true
                    : 'Use a two-letter ISO country code (e.g. FR).';
                }),
            }),
            defineField({
              name: 'placeName',
              title: 'City or region',
              type: 'string',
              description: 'Optional — e.g. a city you remember visiting.',
            }),
            defineField({
              name: 'coordinates',
              title: 'Map coordinates',
              type: 'geopoint',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'string',
              description: 'Optional — trip memory or year.',
            }),
          ],
          preview: {
            select: { title: 'country', subtitle: 'placeName' },
            prepare({ title, subtitle }) {
              return { title: title ?? 'Country', subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Heading',
      type: 'string',
      initialValue: 'Lets create the Future together.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Start a Conversation',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'string',
      initialValue: '/contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Used in the hero and in Person schema sameAs field',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
});
