import { defineIncomingReferenceDecoration } from 'sanity/structure';

/** Shown at the top of the tag form — lists content that references this tag. */
export const tagIncomingReferencesDecoration = defineIncomingReferenceDecoration({
  name: 'incomingReferences',
  title: 'Used on',
  types: [
    { type: 'painting', title: 'Paintings' },
    { type: 'project', title: 'Projects' },
    { type: 'recipe', title: 'Recipes' },
    { type: 'video', title: 'Videos' },
    { type: 'presentation', title: 'Presentations' },
  ],
});
