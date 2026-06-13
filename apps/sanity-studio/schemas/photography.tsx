import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { PhotographyFileMetadataInput } from '../components/PhotographyFileMetadataInput';
import {
  PhotographyPlaceReferenceInput,
  PhotographyWorkflowIntro,
} from '../components/PhotographyPlaceInput';
import {
  PHOTOGRAPHY_ALT_AI_PROMPT,
  PHOTOGRAPHY_CAPTION_AI_PROMPT,
  PHOTOGRAPHY_TITLE_AI_PROMPT,
} from './photographyGuidance';

export default defineType({
  name: 'photography',
  title: 'Photography',
  icon: ImageIcon,
  type: 'document',
  groups: [
    { name: 'content', title: 'Photo', default: true },
    { name: 'details', title: 'Details' },
  ],
  fields: [
    defineField({
      name: 'workflowIntro',
      title: 'Workflow',
      type: 'string',
      group: 'content',
      readOnly: true,
      components: {
        input: PhotographyWorkflowIntro,
      },
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      group: 'content',
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
      name: 'fileMetadataPanel',
      title: 'From uploaded file',
      type: 'string',
      group: 'content',
      readOnly: true,
      components: {
        input: PhotographyFileMetadataInput,
      },
      hidden: ({ document }) => !document?.image?.asset,
    }),
    defineField({
      name: 'place',
      title: 'Travel place',
      type: 'reference',
      group: 'content',
      to: [{ type: 'travelPlace' }],
      description: 'Links this photo to the about travel map. Name and country live on the place.',
      components: {
        input: PhotographyPlaceReferenceInput,
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: rule => rule.required().max(120),
      description: 'Generate after the photo and travel place are set.',
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
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      group: 'content',
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
      name: 'capturedAt',
      title: 'Captured at',
      type: 'datetime',
      group: 'details',
      description: 'Optional — apply from file metadata on the Photo tab.',
    }),
    defineField({
      name: 'camera',
      title: 'Camera / equipment',
      type: 'string',
      group: 'details',
      description: 'Optional — apply from EXIF on the Photo tab.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'details',
    }),
    defineField({
      name: 'viewsCount',
      title: 'Views',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      group: 'details',
      description: 'Tracked on the site — do not edit manually',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'array',
      readOnly: true,
      group: 'details',
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
    defineField({
      name: 'tagsV2',
      title: 'Tags',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      options: { layout: 'list' },
    }),
    // Legacy location fields — kept for migrated content; hidden from editors.
    defineField({
      name: 'placeName',
      title: 'Place name (legacy)',
      type: 'string',
      hidden: () => true,
    }),
    defineField({
      name: 'country',
      title: 'Country (legacy)',
      type: 'string',
      hidden: () => true,
    }),
    defineField({
      name: 'countryCode',
      title: 'Country code (legacy)',
      type: 'string',
      hidden: () => true,
    }),
    defineField({
      name: 'region',
      title: 'Region (legacy)',
      type: 'string',
      hidden: () => true,
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates (legacy)',
      type: 'geopoint',
      hidden: () => true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      placeTitle: 'place.name',
      placeCountry: 'place.countryName',
      legacyPlace: 'placeName',
      legacyCountry: 'country',
      media: 'image',
    },
    prepare({ title, placeTitle, placeCountry, legacyPlace, legacyCountry, media }) {
      const where = placeTitle
        ? [placeTitle, placeCountry].filter(Boolean).join(', ')
        : [legacyPlace, legacyCountry].filter(Boolean).join(', ');
      return {
        title: title ?? 'Untitled photo',
        subtitle: where || 'No travel place linked',
        media,
      };
    },
  },
});
