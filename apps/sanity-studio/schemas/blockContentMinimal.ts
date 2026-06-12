import { defineArrayMember, defineType } from 'sanity';
import { portableTextLinkAnnotation } from './objects/portableTextLink';

/** Short intros and section blurbs — no headings, lists, or embeds. */
export default defineType({
  name: 'blockContentMinimal',
  title: 'Short text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [portableTextLinkAnnotation],
      },
    }),
  ],
});
