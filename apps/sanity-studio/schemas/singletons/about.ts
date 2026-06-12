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
      title: 'Hero eyebrow',
      type: 'string',
      initialValue: 'Biography',
      description:
        'Small label above your name on the about page. Leave as “Biography” or customize.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Your name',
      type: 'string',
      initialValue: 'Henrik Wilhelm Sissener',
      description: 'Full name — main heading and Person schema.',
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
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo for the biography hero. Shown beside your name when set.',
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
        'Cities you have lived in. Add coordinates, fun facts, and stats — personal narrative is not shown on the map.',
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
            defineField({
              name: 'content',
              title: 'Content (legacy)',
              type: 'text',
              rows: 5,
              description: 'Not shown on the about page — use fun fact and place stats instead.',
            }),
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
            defineField({
              name: 'funFact',
              title: 'Fun fact',
              type: 'string',
              description: 'Short hook for map tooltips and the place panel — one sentence.',
            }),
            defineField({
              name: 'stats',
              title: 'Place stats',
              description: 'Quick facts — years lived, population, favourites, etc.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: rule => rule.required(),
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      validation: rule => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'value' },
                  },
                },
              ],
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
        'Travel destinations highlighted as full countries on the travel map. Set Country code (ISO) for reliable map fills.',
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
            defineField({
              name: 'cities',
              title: 'Cities visited',
              description: 'Dots on the travel map for cities explored in this country.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'place',
                      title: 'Travel place',
                      type: 'reference',
                      to: [{ type: 'travelPlace' }],
                      description:
                        'Canonical place document — map card content and photography links use this when set.',
                    }),
                    defineField({
                      name: 'name',
                      title: 'City',
                      type: 'string',
                      description: 'Fallback label when no travel place is linked.',
                      validation: rule =>
                        rule.custom((name, context) => {
                          const parent = context.parent as { place?: { _ref?: string } };
                          if (parent?.place?._ref) return true;
                          return name?.trim() ? true : 'Required when no travel place is linked';
                        }),
                    }),
                    defineField({
                      name: 'coordinates',
                      title: 'Coordinates',
                      type: 'geopoint',
                      description: 'Fallback map pin when no travel place is linked.',
                      validation: rule =>
                        rule.custom((coordinates, context) => {
                          const parent = context.parent as { place?: { _ref?: string } };
                          if (parent?.place?._ref) return true;
                          return coordinates ? true : 'Required when no travel place is linked';
                        }),
                    }),
                    defineField({
                      name: 'isHighlight',
                      title: 'Highlight',
                      type: 'boolean',
                      description: 'Stand-out marker (e.g. Chernobyl).',
                      initialValue: false,
                    }),
                    defineField({
                      name: 'notes',
                      title: 'Notes',
                      type: 'text',
                      rows: 3,
                      description: 'Optional factual context — fun fact is shown first in the UI.',
                    }),
                    defineField({
                      name: 'funFact',
                      title: 'Fun fact',
                      type: 'string',
                      description: 'Short, objective hook for map tooltips and the detail card.',
                    }),
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'stats',
                      title: 'Stats',
                      description: 'Optional facts — e.g. year visited, trips, favourites.',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'label',
                              title: 'Label',
                              type: 'string',
                              validation: rule => rule.required(),
                            }),
                            defineField({
                              name: 'value',
                              title: 'Value',
                              type: 'string',
                              validation: rule => rule.required(),
                            }),
                          ],
                          preview: {
                            select: { title: 'label', subtitle: 'value' },
                          },
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: { title: 'name', highlight: 'isHighlight' },
                    prepare({ title, highlight }) {
                      return {
                        title: title ?? 'City',
                        subtitle: highlight ? '★ Highlight' : undefined,
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'country', subtitle: 'placeName', cities: 'cities' },
            prepare({ title, subtitle, cities }) {
              const cityCount = Array.isArray(cities) ? cities.length : 0;
              const parts = [subtitle, cityCount > 0 ? `${cityCount} cities` : null].filter(
                Boolean,
              );
              return { title: title ?? 'Country', subtitle: parts.join(' · ') || undefined };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'adventurePlaces',
      title: 'Adventure places',
      description: 'Stand-out travel spots on the map (e.g. Svalbard).',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'place',
              title: 'Travel place',
              type: 'reference',
              to: [{ type: 'travelPlace' }],
              description: 'Canonical adventure place — links photography and map card content.',
            }),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Fallback label when no travel place is linked.',
              validation: rule =>
                rule.custom((name, context) => {
                  const parent = context.parent as { place?: { _ref?: string } };
                  if (parent?.place?._ref) return true;
                  return name?.trim() ? true : 'Required when no travel place is linked';
                }),
            }),
            defineField({
              name: 'placeName',
              title: 'Location detail',
              type: 'string',
              description: 'Optional — e.g. Longyearbyen.',
            }),
            defineField({
              name: 'coordinates',
              title: 'Coordinates',
              type: 'geopoint',
              description: 'Fallback map pin when no travel place is linked.',
              validation: rule =>
                rule.custom((coordinates, context) => {
                  const parent = context.parent as { place?: { _ref?: string } };
                  if (parent?.place?._ref) return true;
                  return coordinates ? true : 'Required when no travel place is linked';
                }),
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
              rows: 3,
              description: 'Optional factual context — fun fact is shown first in the UI.',
            }),
            defineField({
              name: 'funFact',
              title: 'Fun fact',
              type: 'string',
              description: 'Short, objective hook for map tooltips and the detail card.',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'stats',
              title: 'Stats',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: rule => rule.required(),
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      validation: rule => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'value' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'placeName', linked: 'place.name' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA heading',
      type: 'string',
      initialValue: 'Say hello',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA description',
      type: 'text',
      rows: 3,
      initialValue: 'Questions about the work, licensing, or anything else — I read every message.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA button text',
      type: 'string',
      initialValue: 'Send a message',
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
