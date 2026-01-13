import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'presentationCategory',
  title: 'Presentation Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The name of this category (e.g., "Introduction", "History", "Business Impact")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Optional description of what this category represents',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Optional color for visual distinction',
      options: {
        list: [
          { title: 'Red', value: '#ef4444' },
          { title: 'Orange', value: '#f97316' },
          { title: 'Yellow', value: '#eab308' },
          { title: 'Green', value: '#22c55e' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Purple', value: '#a855f7' },
          { title: 'Pink', value: '#ec4899' },
          { title: 'Teal', value: '#14b8a6' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      name: 'name',
      description: 'description',
      color: 'color',
    },
    prepare({ name, description, color }: { name?: string; description?: string; color?: string }) {
      return {
        title: name || 'Unnamed Category',
        subtitle: description,
        media: color ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: color,
              borderRadius: '4px',
            }}
          />
        ) : TagIcon,
      };
    },
  },
});
