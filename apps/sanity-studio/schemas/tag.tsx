import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

// A small inline component that returns a color-filled box
function ColorSwatch(color?: string) {
  if (!color) return null
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: color,
        borderRadius: '4px', // or '50%' if you want a circle
      }}
    />
  )
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    // New color field (optional)
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Enter a CSS color (e.g. #FF0000, rgb(255, 0, 0), or "hotpink")',
    }),
  ],
  preview: {
    select: {
      // We’ll still use 'name' and 'description' for the title/subtitle
      title: 'name',
      subtitle: 'description',
      // Grab the color from the new field
      color: 'color',
    },
    prepare({title, subtitle, color}) {
      return {
        title,
        subtitle,
        // Use our color swatch if we have a color; otherwise fallback to TagIcon
        media: color ? ColorSwatch(color) : TagIcon,
      }
    },
  },
})
