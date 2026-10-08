import { ComposeIcon } from '@sanity/icons/Compose';
import { HomeIcon } from '@sanity/icons/Home';
import { ImagesIcon } from '@sanity/icons/Images';
import { PlayIcon } from '@sanity/icons/Play';
import { RocketIcon } from '@sanity/icons/Rocket';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { TagIcon } from '@sanity/icons/Tag';
import { UsersIcon } from '@sanity/icons/Users';
import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  HERO_INTRO_MAX_CHARS,
  requiredPortableTextMax,
  SECTION_INTRO_MAX_CHARS,
} from '../validators/portableTextLength';

const sectionPreview = (title: string, subtitle?: string) => ({
  prepare: () => ({ title, subtitle }),
});

export const homeHeroSection = defineType({
  name: 'homeHeroSection',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'overview',
      title: 'Home intro',
      type: 'blockContentMinimal',
      description:
        'Shown below your name in the hero. Also used for the home page meta description.',
      validation: requiredPortableTextMax(HERO_INTRO_MAX_CHARS),
    }),
  ],
  preview: sectionPreview('Hero', 'Intro + collage'),
});

export const homeProjectsSection = defineType({
  name: 'homeProjectsSection',
  title: 'Featured projects',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Section intro',
      type: 'blockContentMinimal',
      description: `Intro copy above the featured projects grid. Max ${SECTION_INTRO_MAX_CHARS} characters.`,
      validation: requiredPortableTextMax(SECTION_INTRO_MAX_CHARS),
    }),
    defineField({
      name: 'showcaseProjects',
      title: 'Showcase projects',
      description: 'Projects shown in this section and mixed into the hero collage.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
    }),
  ],
  preview: sectionPreview('Featured projects'),
});

export const homePaintingsSection = defineType({
  name: 'homePaintingsSection',
  title: 'Paintings gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Section intro',
      type: 'blockContentMinimal',
      description: `Intro copy above the paintings gallery. Max ${SECTION_INTRO_MAX_CHARS} characters.`,
      validation: requiredPortableTextMax(SECTION_INTRO_MAX_CHARS),
    }),
    defineField({
      name: 'showcasePaintings',
      title: 'Showcase paintings',
      description: 'Paintings shown in this section and mixed into the hero collage.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'painting' }] })],
    }),
  ],
  preview: sectionPreview('Paintings gallery'),
});

export const homeAboutTeaserSection = defineType({
  name: 'homeAboutTeaserSection',
  title: 'About teaser',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: '// About' }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      initialValue: 'Code, canvas, and curiosity',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Leave empty to auto-build from the About page bio.',
    }),
    defineField({
      name: 'primaryLabel',
      title: 'Primary button label',
      type: 'string',
      initialValue: 'My story',
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Secondary button label',
      type: 'string',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'journeyEyebrow',
      title: 'Journey card eyebrow',
      type: 'string',
      initialValue: 'Life journey',
    }),
    defineField({
      name: 'journeyLinkLabel',
      title: 'Journey card link label',
      type: 'string',
      initialValue: 'View full journey',
    }),
  ],
  preview: sectionPreview('About teaser'),
});

export const homeVideosTeaserSection = defineType({
  name: 'homeVideosTeaserSection',
  title: 'Videos teaser',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'intro',
      title: 'Section copy',
      type: 'homeSectionIntro',
      initialValue: {
        eyebrow: '// Motion',
        title: 'Process & playback',
        description:
          'Timelapses, animation tests, and game dev clips — a look behind the still frames.',
        linkLabel: 'All videos',
      },
    }),
  ],
  preview: sectionPreview('Videos teaser', 'Hidden when no videos exist'),
});

export const homeShopTeaserSection = defineType({
  name: 'homeShopTeaserSection',
  title: 'Shop / prints teaser',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'intro',
      title: 'Section copy',
      type: 'homeSectionIntro',
      initialValue: {
        eyebrow: '// Shop',
        title: 'Available as prints',
        description:
          'Selected works available through print-on-demand — take a piece of the gallery home.',
        linkLabel: 'Browse gallery',
      },
    }),
  ],
  preview: sectionPreview('Shop teaser', 'Hidden when no prints for sale'),
});

export const homeSkillsSection = defineType({
  name: 'homeSkillsSection',
  title: 'Skills',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: '// Skills',
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      initialValue: 'What I work with',
    }),
  ],
  preview: sectionPreview('Skills'),
});

export const homeContactCtaSection = defineType({
  name: 'homeContactCtaSection',
  title: 'Contact CTA',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: '// Contact',
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      description: 'Leave empty to use the CTA heading from the About page.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue: 'Questions about the work, licensing, or anything else — I read every message.',
    }),
    defineField({
      name: 'primaryLabel',
      title: 'Primary button label',
      type: 'string',
      description: 'Leave empty to use the CTA button text from the About page.',
    }),
    defineField({
      name: 'primaryUrl',
      title: 'Primary button URL',
      type: 'string',
      description: 'Leave empty to use the CTA URL from the About page.',
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Secondary button label',
      type: 'string',
      initialValue: 'View projects',
    }),
    defineField({
      name: 'secondaryUrl',
      title: 'Secondary button URL',
      type: 'string',
      initialValue: '/projects',
    }),
  ],
  preview: sectionPreview('Contact CTA'),
});

export const homePageSectionTypes = [
  homeHeroSection,
  homeProjectsSection,
  homePaintingsSection,
  homeAboutTeaserSection,
  homeVideosTeaserSection,
  homeShopTeaserSection,
  homeSkillsSection,
  homeContactCtaSection,
] as const;

export const homePageSectionInsertMenu = {
  groups: [
    {
      name: 'intro',
      title: 'Intro',
      of: ['homeHeroSection'],
    },
    {
      name: 'portfolio',
      title: 'Portfolio',
      of: ['homeProjectsSection', 'homePaintingsSection'],
    },
    {
      name: 'marketing',
      title: 'Marketing',
      of: [
        'homeAboutTeaserSection',
        'homeVideosTeaserSection',
        'homeShopTeaserSection',
        'homeSkillsSection',
        'homeContactCtaSection',
      ],
    },
  ],
  views: [{ name: 'grid', previewImageUrl: () => '' }, { name: 'list' }],
};

/** Default section stack for new home documents. */
export const defaultHomeSections = [
  { _type: 'homeHeroSection' as const },
  { _type: 'homeProjectsSection' as const },
  { _type: 'homePaintingsSection' as const },
  { _type: 'homeAboutTeaserSection' as const },
  { _type: 'homeVideosTeaserSection' as const },
  { _type: 'homeShopTeaserSection' as const },
  { _type: 'homeSkillsSection' as const },
];
