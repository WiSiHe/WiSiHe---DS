import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import GenericAIGenerator from '../components/GenericAIGenerator';
import { TAG_DESCRIPTION_AI_PROMPT } from './tagGuidance';
import { tagIncomingReferencesDecoration } from './tagIncomingReferences';

function ColorSwatch(color?: string) {
  if (!color) return null;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: color,
        borderRadius: '4px',
      }}
    />
  );
}

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  icon: TagIcon,
  type: 'document',
  orderings: [
    {
      title: 'Name, A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Featured first',
      name: 'featuredNameAsc',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  renderMembers: members => [tagIncomingReferencesDecoration, ...members],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'Used on the site for filters, cards, and search. Reuse existing tags instead of creating near-duplicates.',
      validation: rule =>
        rule
          .required()
          .min(2)
          .max(50)
          .custom(async (name, context) => {
            if (typeof name !== 'string') return true;

            const trimmed = name.trim();
            if (trimmed !== name) {
              return 'Remove leading or trailing spaces';
            }

            const documentId = context.document?._id?.replace(/^drafts\./, '');
            if (!documentId) return true;

            const client = context.getClient({ apiVersion: '2024-10-28' });
            const duplicates = await client.fetch<number>(
              `count(*[
                _type == "tag" &&
                name == $name &&
                !(_id in [$draftId, $publishedId])
              ])`,
              {
                name: trimmed,
                draftId: `drafts.${documentId}`,
                publishedId: documentId,
              },
            );

            return duplicates > 0 ? 'A tag with this name already exists' : true;
          }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional note for editors and AI — not shown on the website.',
      components: {
        input: props => (
          <GenericAIGenerator
            {...props}
            prompt={`${TAG_DESCRIPTION_AI_PROMPT}\n\nTag name: "{tagName}"`}
            transformResponse={response =>
              response
                .replace(/^["']|["']$/g, '')
                .replace(/\n/g, ' ')
                .trim()
                .substring(0, 150)
            }
            fieldDependencies={{ name: 'tagName' }}
            characterLimit={150}
            rows={3}
            placeholder='Optional — helps when picking or generating tags...'
          />
        ),
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured tags appear first in project filters on the website.',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers sort first in Studio tag lists.',
      initialValue: 0,
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Swatch color in Studio lists only.',
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      color: 'color',
      isFeatured: 'isFeatured',
    },
    prepare({ title, subtitle, color, isFeatured }) {
      return {
        title: isFeatured ? `${title} ⭐` : title,
        subtitle: subtitle as string,
        media: color ? ColorSwatch(color as string) : TagIcon,
      };
    },
  },
});
