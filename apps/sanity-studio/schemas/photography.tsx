import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { PhotographyCountryInput } from '../components/PhotographyCountryInput';
import { PhotographyFileMetadataInput } from '../components/PhotographyFileMetadataInput';
import {
  PHOTOGRAPHY_ALT_AI_PROMPT,
  PHOTOGRAPHY_CAPTION_AI_PROMPT,
  PHOTOGRAPHY_PLACE_AI_PROMPT,
  PHOTOGRAPHY_REGION_AI_PROMPT,
  PHOTOGRAPHY_TITLE_AI_PROMPT,
} from './photographyGuidance';

export default defineType({
  name: 'photography',
  title: 'Photography',
  icon: ImageIcon,
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'location', title: 'Location' },
    { name: 'seo', title: 'SEO' },
    { name: 'AI', title: 'AI', icon: ImageIcon },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: ['content', 'AI'],
      validation: rule => rule.required().max(120),
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PHOTOGRAPHY_TITLE_AI_PROMPT}
            imageField='image'
            includeFileMetadata
            characterLimit={80}
            rows={2}
            placeholder='Evocative title…'
          />
        ),
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      group: ['content', 'AI'],
      options: {
        hotspot: true,
        metadata: ['lqip', 'blurhash', 'palette', 'exif', 'location'],
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: rule => rule.required(),
          components: {
            input: props => (
              <GenericAIGenerator
                {...props}
                prompt={PHOTOGRAPHY_ALT_AI_PROMPT}
                imageField='image'
                includeFileMetadata
                characterLimit={96}
                rows={2}
                placeholder='Alt text…'
              />
            ),
          },
        }),
      ],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      group: ['content', 'AI'],
      description: 'Short description shown in galleries and previews.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PHOTOGRAPHY_CAPTION_AI_PROMPT}
            imageField='image'
            includeFileMetadata
            characterLimit={280}
            rows={4}
            placeholder='Gallery caption…'
          />
        ),
      },
    }),
    defineField({
      name: 'place',
      title: 'Travel place',
      type: 'reference',
      group: 'location',
      to: [{ type: 'travelPlace' }],
      description:
        'Links this photo to a place on the about map (e.g. Narbonne). Preferred over typing country/place manually.',
    }),
    defineField({
      name: 'placeName',
      title: 'Place name',
      type: 'string',
      group: ['location', 'AI'],
      description:
        'Where the photo was taken — city, landmark, or area. AI guesses from the image; verify before publishing.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PHOTOGRAPHY_PLACE_AI_PROMPT}
            imageField='image'
            includeFileMetadata
            rows={2}
            placeholder='Place name…'
          />
        ),
      },
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'location',
      description:
        'Pick from the list — ISO code is saved automatically for the about page travel map.',
      components: {
        input: PhotographyCountryInput,
      },
    }),
    defineField({
      name: 'countryCode',
      title: 'Country code (ISO)',
      type: 'string',
      group: 'location',
      readOnly: true,
      hidden: () => true,
      description: 'Set automatically when you choose a country.',
      validation: rule =>
        rule.custom(value => {
          if (!value) return true;
          return /^[A-Za-z]{2}$/.test(value)
            ? true
            : 'Use a two-letter ISO country code (e.g. NO).';
        }),
    }),
    defineField({
      name: 'fileMetadataPanel',
      title: 'From uploaded file',
      type: 'string',
      group: 'location',
      readOnly: true,
      components: {
        input: PhotographyFileMetadataInput,
      },
      hidden: ({ document }) => !document?.image?.asset,
    }),
    defineField({
      name: 'region',
      title: 'Region / state',
      type: 'string',
      group: ['location', 'AI'],
      description:
        'Optional — county, province, or region. AI guesses from the image; verify before publishing.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={PHOTOGRAPHY_REGION_AI_PROMPT}
            imageField='image'
            includeFileMetadata
            rows={2}
            placeholder='Region…'
          />
        ),
      },
    }),
    defineField({
      name: 'coordinates',
      title: 'Map coordinates',
      type: 'geopoint',
      group: 'location',
      description: 'Pin the capture location on a map.',
    }),
    defineField({
      name: 'capturedAt',
      title: 'Captured at',
      type: 'datetime',
      group: 'location',
      description: 'When the photo was taken.',
    }),
    defineField({
      name: 'camera',
      title: 'Camera / equipment',
      type: 'string',
      group: 'content',
      description:
        'Optional — body, lens, or phone model. Apply from file reads EXIF Make/Model/Lens when available.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),
    defineField({
      name: 'tagsV2',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      options: { layout: 'list' },
    }),
    defineField({
      name: 'seo',
      title: 'SEO overrides',
      type: 'seo',
      group: 'seo',
      description:
        'SEO description supports AI generation from the photo, title, caption, and location fields.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      country: 'country',
      countryCode: 'countryCode',
      placeName: 'placeName',
      media: 'image',
    },
    prepare({ title, country, countryCode, placeName, media }) {
      const where = [placeName, country ?? countryCode].filter(Boolean).join(', ');
      return {
        title: title ?? 'Untitled photo',
        subtitle: where || 'No location set',
        media,
      };
    },
  },
});
