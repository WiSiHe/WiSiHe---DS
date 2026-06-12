import { EarthGlobeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { CountryNameWithIsoField } from '../components/CountryNameWithIsoField';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { GeopointAssistInput } from '../components/GeopointAssistInput';
import { TravelPlaceAssistPanel } from '../components/TravelPlaceAssistPanel';
import { TravelPlaceWorkflowIntro } from '../components/TravelPlaceWorkflowIntro';
import { placeStatsField } from './objects/placeStats';
import { TRAVEL_PLACE_FUN_FACT_PROMPT, TRAVEL_PLACE_NOTES_PROMPT } from './travelPlaceGuidance';

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
      name: 'workflowIntro',
      title: 'Workflow',
      type: 'string',
      group: 'location',
      readOnly: true,
      components: {
        input: TravelPlaceWorkflowIntro,
      },
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
      name: 'image',
      title: 'Hero image',
      type: 'image',
      group: 'location',
      options: {
        hotspot: true,
        metadata: ['lqip', 'blurhash', 'exif', 'location'],
      },
      description: 'Upload first if the file has GPS — the assistant below can read it.',
    }),
    defineField({
      name: 'locationAssistPanel',
      title: 'Location assistant',
      type: 'string',
      group: 'location',
      readOnly: true,
      components: {
        input: TravelPlaceAssistPanel,
      },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'location',
      description: 'Filled from GPS via the assistant, or type manually — e.g. Narbonne.',
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
      description: 'Usually filled from photo GPS — see location assistant.',
      components: {
        input: GeopointAssistInput,
      },
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
      description:
        'Generate after name and country are set — objective fact, not personal narrative.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={TRAVEL_PLACE_FUN_FACT_PROMPT}
            imageField='image'
            imageRequired={false}
            includeFileMetadata
            characterLimit={120}
            rows={2}
            placeholder='Objective fact about this place…'
          />
        ),
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'Optional extra context — factual background shown after the fun fact on the map card.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={TRAVEL_PLACE_NOTES_PROMPT}
            imageField='image'
            imageRequired={false}
            includeFileMetadata
            rows={4}
            placeholder='Objective context about this place…'
          />
        ),
      },
    }),
    placeStatsField,
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
