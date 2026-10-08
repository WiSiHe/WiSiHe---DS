import { HomeIcon } from '@sanity/icons/Home';
import { defineField, defineType } from 'sanity';
import { defaultHomeSections, homePageSectionInsertMenu } from '../objects/homePageSections';
import { requiredPortableTextMax } from '../validators/portableTextLength';

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'page', title: 'Page builder', default: true },
    { name: 'archive', title: 'Archive pages' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Page sections',
      description: 'Drag to reorder. Add or remove sections to customize the home page layout.',
      type: 'array',
      group: 'page',
      of: [
        { type: 'homeHeroSection' },
        { type: 'homeProjectsSection' },
        { type: 'homePaintingsSection' },
        { type: 'homeAboutTeaserSection' },
        { type: 'homeVideosTeaserSection' },
        { type: 'homeShopTeaserSection' },
        { type: 'homeSkillsSection' },
        { type: 'homeContactCtaSection' },
      ],
      options: {
        insertMenu: homePageSectionInsertMenu,
      },
      initialValue: defaultHomeSections,
      validation: rule => rule.min(1).error('Add at least one section'),
    }),

    // ── Archive page copy (not part of the home page builder) ───────────────
    defineField({
      name: 'projectsTitle',
      title: 'Projects archive title',
      description: 'Browser title for /projects.',
      type: 'string',
      group: 'archive',
    }),
    defineField({
      name: 'projectsListingDescription',
      title: 'Projects archive intro',
      description: 'Meta description for /projects.',
      type: 'blockContentMinimal',
      group: 'archive',
      validation: requiredPortableTextMax(155),
    }),
    defineField({
      name: 'paintingsTitle',
      title: 'Paintings archive title',
      description: 'Browser title for /paintings.',
      type: 'string',
      group: 'archive',
    }),
    defineField({
      name: 'paintingsDescription',
      title: 'Paintings archive description',
      description: 'Meta description for /paintings.',
      type: 'blockContentMinimal',
      group: 'archive',
      validation: requiredPortableTextMax(155),
    }),

    // ── SEO ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      description: 'Site title used in the browser tab and home page meta title.',
      title: 'Site title',
      type: 'string',
      group: 'seo',
      validation: rule => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sectionCount: 'sections.length',
    },
    prepare({ title = '', sectionCount = 0 }: { title?: string; sectionCount?: number }) {
      return {
        title: title || 'Home',
        subtitle: `${sectionCount} section${sectionCount === 1 ? '' : 's'}`,
      };
    },
  },
});
