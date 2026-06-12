import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      description: 'If provided, this will override the title field',
      type: 'string',
      validation: rule =>
        rule.max(60).warning('SEO titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      description: 'If provided, this will override the description field',
      validation: rule =>
        rule
          .max(160)
          .warning('SEO descriptions over 160 characters may be truncated in search results'),
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt="Write a compelling SEO meta description for '{contentTitle}'. Context: {contentContext}. Place: {placeName}, {country}. Keep it under 160 characters, include relevant keywords naturally, and encourage clicks from search results."
            imageField='image'
            fieldDependencies={{
              title: 'contentTitle',
              name: 'contentTitle',
              description: 'contentContext',
              caption: 'contentContext',
              projectType: 'contentContext',
              placeName: 'placeName',
              country: 'country',
              countryCode: 'country',
            }}
            characterLimit={160}
            rows={3}
            placeholder='AI-generated SEO description will appear here...'
            transformResponse={response => {
              // Ensure the response is within character limits
              const cleaned = response.replace(/"/g, '').trim();
              return cleaned.length > 160 ? `${cleaned.substring(0, 157)}...` : cleaned;
            }}
          />
        ),
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      description: 'If provided, this will override the image field',
    }),
    defineField({
      name: 'noIndex',
      type: 'boolean',
      description: 'If checked, search engines will not index this page',
    }),
  ],
});
