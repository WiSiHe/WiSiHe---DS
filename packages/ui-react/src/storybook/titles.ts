/**
 * Canonical Storybook story titles for redirects and documentation.
 *
 * Storybook 10 requires string literals in CSF `title` fields (no variable refs).
 * Keep story file titles in sync with `STORY` values here.
 *
 * Top-level order: Design System → Cards → Effects → Tokens
 */
export const STORY = {
  designSystem: {
    atoms: {
      badge: 'Design System/Atoms/Badge',
      button: 'Design System/Atoms/Button',
      checkbox: 'Design System/Atoms/Checkbox',
      combobox: 'Design System/Atoms/Combobox',
      iconBadge: 'Design System/Atoms/IconBadge',
      input: 'Design System/Atoms/Input',
      select: 'Design System/Atoms/Select',
      skeleton: 'Design System/Atoms/Skeleton',
      spinner: 'Design System/Atoms/Spinner',
      switch: 'Design System/Atoms/Switch',
      tag: 'Design System/Atoms/Tag',
      textarea: 'Design System/Atoms/Textarea',
    },
    molecules: {
      breadcrumbs: 'Design System/Molecules/Breadcrumbs',
      card: 'Design System/Molecules/Card',
      chip: 'Design System/Molecules/Chip',
      dialog: 'Design System/Molecules/Dialog',
      glassSurface: 'Design System/Molecules/GlassSurface',
      pagination: 'Design System/Molecules/Pagination',
      popover: 'Design System/Molecules/Popover',
      recipeMetaBadges: 'Design System/Molecules/RecipeMetaBadges',
      sectionHeader: 'Design System/Molecules/SectionHeader',
      tabs: 'Design System/Molecules/Tabs',
    },
  },
  cards: {
    painting: {
      paintingCard: 'Cards/Painting/PaintingCard',
      thumbnail: 'Cards/Painting/PaintingThumbnail',
    },
    project: {
      projectCard: 'Cards/Project/ProjectCard',
    },
    photography: {
      photographyCard: 'Cards/Photography/PhotographyCard',
    },
  },
  effects: {
    brushReveal: 'Effects/BrushReveal',
  },
  tokens: {
    color: 'Tokens/Color',
  },
} as const;

/** Storybook sidebar top-level order (see apps/ui-docs/.storybook/preview.ts). */
export const STORYBOOK_TOP_LEVEL_ORDER = ['Design System', 'Cards', 'Effects', 'Tokens'] as const;

/** Converts a CSF `title` to the kebab-case story id prefix (before `--StoryName`). */
export function storyIdPrefix(title: string): string {
  return title.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
}

/** Old CSF titles → new titles for bookmark redirects. */
export const LEGACY_STORY_TITLE_MIGRATIONS: ReadonlyArray<readonly [string, string]> = [
  ['Atoms/Badge', STORY.designSystem.atoms.badge],
  ['Atoms/Button', STORY.designSystem.atoms.button],
  ['Atoms/Checkbox', STORY.designSystem.atoms.checkbox],
  ['Atoms/Combobox', STORY.designSystem.atoms.combobox],
  ['Atoms/IconBadge', STORY.designSystem.atoms.iconBadge],
  ['Atoms/Input', STORY.designSystem.atoms.input],
  ['Atoms/Select', STORY.designSystem.atoms.select],
  ['Atoms/Skeleton', STORY.designSystem.atoms.skeleton],
  ['Components/Spinner', STORY.designSystem.atoms.spinner],
  ['Atoms/Switch', STORY.designSystem.atoms.switch],
  ['Atoms/Tag', STORY.designSystem.atoms.tag],
  ['Atoms/Textarea', STORY.designSystem.atoms.textarea],
  ['Molecules/Breadcrumbs', STORY.designSystem.molecules.breadcrumbs],
  ['Molecules/Card', STORY.designSystem.molecules.card],
  ['Molecules/Chip', STORY.designSystem.molecules.chip],
  ['Molecules/Dialog', STORY.designSystem.molecules.dialog],
  ['Molecules/GlassSurface', STORY.designSystem.molecules.glassSurface],
  ['Molecules/Pagination', STORY.designSystem.molecules.pagination],
  ['Molecules/Popover', STORY.designSystem.molecules.popover],
  ['Molecules/SectionHeader', STORY.designSystem.molecules.sectionHeader],
  ['Molecules/Tabs', STORY.designSystem.molecules.tabs],
  ['Molecules/PaintingCard', STORY.cards.painting.paintingCard],
  ['Cards/PaintingThumbnail', STORY.cards.painting.thumbnail],
  ['Cards/Painting/Thumbnail', STORY.cards.painting.thumbnail],
  ['Cards/ProjectCard', STORY.cards.project.projectCard],
  ['Cards/PhotographyCard', STORY.cards.photography.photographyCard],
  ['Cards/RecipeMetaBadges', STORY.designSystem.molecules.recipeMetaBadges],
  ['Design Tokens/Colors', STORY.tokens.color],
];

/** Explicit id overrides (renamed title segments that prefix matching cannot infer). */
export const LEGACY_STORY_ID_OVERRIDES: Record<string, string> = {
  'molecules-paintingcard-shell--default': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--default`,
  'molecules-paintingcard-shell--for-sale': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--default`,
  'molecules-paintingcard-shell--with-badges': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--default`,
  'molecules-paintingcard-shell--nsfw-blurred': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--nsfw-blurred`,
  'molecules-paintingcard-shell--nsfw-visible': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--nsfw-visible`,
  'molecules-paintingcard-shell--no-image': `${storyIdPrefix(STORY.cards.painting.paintingCard)}--default`,
};

export function resolveLegacyStoryId(storyId: string): string | null {
  const override = LEGACY_STORY_ID_OVERRIDES[storyId];
  if (override) return override;

  for (const [oldTitle, newTitle] of LEGACY_STORY_TITLE_MIGRATIONS) {
    const oldPrefix = storyIdPrefix(oldTitle);
    const newPrefix = storyIdPrefix(newTitle);
    if (storyId === oldPrefix || storyId.startsWith(`${oldPrefix}--`)) {
      return newPrefix + storyId.slice(oldPrefix.length);
    }
  }

  return null;
}
