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
            prompt="Create an engaging SEO description for a {projectType} project called '{projectName}' with status '{projectStatus}'. Project themes/topics: {projectTags}. Project details: {projectContent}. Keep it under 160 characters, compelling, and include relevant keywords. Focus on what makes this project unique and valuable."
            fieldDependencies={{
              name: 'projectName',
              projectType: 'projectType',
              status: 'projectStatus',
              tags: 'projectTags',
              content: 'projectContent',
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
