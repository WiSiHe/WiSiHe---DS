import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'mermaidDiagram',
  title: 'Mermaid diagram',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Diagram source',
      type: 'text',
      rows: 12,
      description:
        'Mermaid syntax — flowcharts, sequence diagrams, architecture sketches, git graphs, etc.',
      validation: rule => rule.required().min(3).error('Diagram source is required'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional label shown below the diagram.',
    }),
  ],
  preview: {
    select: { code: 'code', caption: 'caption' },
    prepare({ code, caption }: { code?: string; caption?: string }) {
      const firstLine =
        code
          ?.split('\n')
          .map(line => line.trim())
          .find(Boolean) ?? 'Empty diagram';

      return {
        title: caption?.trim() || 'Mermaid diagram',
        subtitle: firstLine.length > 72 ? `${firstLine.slice(0, 72)}…` : firstLine,
      };
    },
  },
});
