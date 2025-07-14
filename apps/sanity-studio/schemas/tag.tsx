import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';

// A small inline component that returns a color-filled box
function ColorSwatch(color?: string) {
  if (!color) return null;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: color,
        borderRadius: '4px', // or '50%' if you want a circle
      }}
    />
  );
}

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: rule => rule.required(),
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt="Create a clear, concise description for a tag named '{tagName}'{parentContext}. This tag will be used to categorize content like paintings, projects, and recipes. The description should explain what this tag represents and help users understand what kind of content it applies to. If there's a parent tag, consider how this tag relates to and specializes the parent category. Keep it under 150 characters and focus on being helpful for content discovery and organization."
            transformResponse={response => {
              // Clean up the response and ensure it's concise
              let cleaned = response
                .replace(/^["']|["']$/g, '') // Remove surrounding quotes
                .replace(/\n/g, ' ') // Replace newlines with spaces
                .trim();

              // Handle parent context in the prompt
              if (cleaned.includes('{parentContext}')) {
                cleaned = cleaned.replace('{parentContext}', '');
              }

              return cleaned.substring(0, 150); // Ensure it's under 150 characters
            }}
            fieldDependencies={{
              name: 'tagName',
              'parent.name': 'parentContext',
            }}
            characterLimit={150}
            rows={3}
            placeholder="Enter a description for this tag or use AI to generate one..."
          />
        ),
      },
    }),
    defineField({
      name: 'parent',
      title: 'Parent Tag',
      type: 'reference',
      to: [{ type: 'tag' }],
      description:
        'Optional parent tag to create a hierarchy (e.g., "Digital Art" could be parent of "Concept Art")',
    }),
    defineField({
      name: 'children',
      title: 'Child Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description:
        'Child tags that belong under this tag (auto-populated based on parent references)',
      readOnly: true,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Enter a CSS color (e.g. #FF0000, rgb(255, 0, 0), or "hotpink")',
      options: {
        list: [
          { title: 'Red', value: '#ef4444' },
          { title: 'Orange', value: '#f97316' },
          { title: 'Yellow', value: '#eab308' },
          { title: 'Green', value: '#22c55e' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Purple', value: '#a855f7' },
          { title: 'Pink', value: '#ec4899' },
          { title: 'Gray', value: '#6b7280' },
          { title: 'Brown', value: '#a16207' },
          { title: 'Teal', value: '#14b8a6' },
        ],
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Tag',
      type: 'boolean',
      description: 'Featured tags appear more prominently in filters and navigation',
      initialValue: false,
    }),
    defineField({
      name: 'isRoot',
      title: 'Root Tag',
      type: 'boolean',
      description: 'Root tags are top-level tags that can be used as main categories',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in which this tag appears in lists (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      color: 'color',
      parent: 'parent.name',
      isFeatured: 'isFeatured',
      isRoot: 'isRoot',
      childrenCount: 'children',
    },
    prepare({ title, subtitle, color, parent, isFeatured, isRoot, childrenCount }) {
      const badges = [];
      if (isFeatured) badges.push('⭐');
      if (isRoot) badges.push('🌳');
      if (parent) badges.push(`📁 ${parent}`);
      if (childrenCount && Array.isArray(childrenCount) && childrenCount.length > 0)
        badges.push(`📂 ${childrenCount.length} children`);

      return {
        title: `${title}${badges.length > 0 ? ` ${badges.join(' ')}` : ''}`,
        subtitle: subtitle as string,
        media: color ? ColorSwatch(color as string) : TagIcon,
      };
    },
  },
});
