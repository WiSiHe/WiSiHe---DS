import { defineField } from 'sanity';

export const placeStatsField = defineField({
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
});
