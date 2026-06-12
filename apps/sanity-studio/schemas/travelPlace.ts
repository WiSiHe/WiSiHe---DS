import { EarthGlobeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { CountryNameWithIsoField } from '../components/CountryNameWithIsoField';
import { placeStatsField } from './objects/placeStats';

export default defineType({
  name: 'travelPlace',
  title: 'Travel place',
  icon: EarthGlobeIcon,
  type: 'document',
  groups: [
    { name: 'location', title: 'Location', default: true },
    { name: 'content', title: 'Map card' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'location',
      description: 'City, region, or adventure spot — e.g. Narbonne, Svalbard.',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'location',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      group: 'location',
      initialValue: 'city',
      options: {
        list: [
          { title: 'City / town', value: 'city' },
          { title: 'Adventure / special', value: 'adventure' },
        ],
        layout: 'radio',
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'countryName',
      title: 'Country',
      type: 'string',
      group: 'location',
      validation: rule => rule.required(),
      components: {
        input: CountryNameWithIsoField,
      },
    }),
    defineField({
      name: 'countryCode',
      title: 'Country code (ISO)',
      type: 'string',
      group: 'location',
      readOnly: true,
      hidden: ({ document }) => !document?.countryName,
      validation: rule =>
        rule.custom(value => {
          if (!value) return true;
          return /^[A-Za-z]{2}$/.test(value)
            ? true
            : 'Use a two-letter ISO country code (e.g. FR).';
        }),
    }),
    defineField({
      name: 'coordinates',
      title: 'Map coordinates',
      type: 'geopoint',
      group: 'location',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'isHighlight',
      title: 'Highlight on map',
      type: 'boolean',
      group: 'location',
      initialValue: false,
    }),
    defineField({
      name: 'funFact',
      title: 'Fun fact',
      type: 'string',
      group: 'content',
      description: 'Short hook for map tooltips and the detail card.',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Optional longer memory — fun fact is shown first in the UI.',
    }),
    placeStatsField,
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Optional — shown on the about travel map card.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      country: 'countryName',
      kind: 'kind',
      media: 'image',
    },
    prepare({ title, country, kind, media }) {
      return {
        title: title ?? 'Place',
        subtitle: [country, kind === 'adventure' ? 'Adventure' : 'City']
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
  initialValue: {
    kind: 'city',
  },
});
