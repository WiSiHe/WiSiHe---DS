/** Tailwind spacing scale — primary layout rhythm in this app. */
export const spacingScale = [
  { token: '1', px: 4, class: 'p-1 / gap-1', use: 'Micro nudge, icon inset' },
  { token: '2', px: 8, class: 'p-2 / gap-2', use: 'Compact chips, tight stacks' },
  { token: '3', px: 12, class: 'p-3 / gap-3', use: 'Inline groups, grid gaps' },
  { token: '4', px: 16, class: 'p-4 / gap-4', use: 'Cards, form fields, do/don\u2019t rows' },
  { token: '5', px: 20, class: 'p-5 / gap-5', use: 'Gallery panels' },
  { token: '6', px: 24, class: 'p-6 / gap-6', use: 'Section headings to content' },
  { token: '8', px: 32, class: 'p-8 / gap-8', use: 'Page sections, shell padding' },
  { token: '10', px: 40, class: 'py-10', use: 'Design-system page vertical rhythm' },
  { token: '12', px: 48, class: 'p-12 / gap-12', use: 'Hero / marketing blocks' },
] as const;

/** Token-backed radius — `rounded-*` utilities read from @wisihe/tokens. */
export const radiusScale = [
  { token: 'sm', px: 4, class: 'rounded-sm', use: 'Subtle inset, tags' },
  { token: 'md', px: 8, class: 'rounded-md', use: 'Inputs, small surfaces' },
  { token: 'lg', px: 12, class: 'rounded-lg', use: 'Chips, nested panels' },
  { token: 'xl', px: 16, class: 'rounded-xl', use: 'Cards, @wisihe/ui-react Button' },
  { token: '2xl', px: 24, class: 'rounded-2xl', use: 'Hero panels, modals' },
  { token: '3xl', px: 32, class: 'rounded-3xl', use: 'Large marketing shells' },
  { token: 'full', px: null, class: 'rounded-full', use: 'Pills, icon buttons, avatars' },
] as const;

export const controlHeights = [
  { token: 'size-9', px: 36, use: 'Compact buttons (Button md)' },
  { token: 'size-10', px: 40, use: 'Icon controls, inputs' },
  { token: 'size-11', px: 44, use: 'Minimum touch target (mobile nav)' },
  { token: 'size-12', px: 48, use: 'Logo hit area, large icon buttons' },
] as const;

export const layoutPatterns = [
  {
    name: 'Card',
    classes: 'rounded-xl border border-border bg-surface/50 p-4',
    note: 'Default content card',
  },
  {
    name: 'Section stack',
    classes: 'space-y-8 mb-12',
    note: 'Vertical rhythm between blocks',
  },
  {
    name: 'Page shell',
    classes: 'px-4 py-10 md:px-0',
    note: 'Design-system and content pages',
  },
  {
    name: 'Inline row',
    classes: 'flex items-center gap-3',
    note: 'Icon + label, meta rows',
  },
] as const;

export const breakpoints = [
  { name: 'sm', px: 640, use: 'Two-column grids' },
  { name: 'md', px: 768, use: 'Sidebar layouts' },
  { name: 'lg', px: 1024, use: 'Design-system sidebar visible' },
  { name: 'xl', px: 1280, use: 'Wide marketing grids' },
  { name: '2xl', px: 1536, use: 'Max content width contexts' },
] as const;

export const shadowScale = [
  { token: 'shadow-sm', use: 'Resting cards' },
  { token: 'shadow-md', use: 'Hover lift on buttons' },
  { token: 'shadow-lg', use: 'Floating chrome (dock, nav)' },
  { token: 'shadow-none', use: 'Flat surfaces on busy backgrounds' },
] as const;

export const primitiveSpacing = [
  { name: 'spacing.xs', px: 4 },
  { name: 'spacing.sm', px: 8 },
  { name: 'spacing.md', px: 16 },
  { name: 'spacing.lg', px: 24 },
  { name: 'spacing.xl', px: 32 },
  { name: 'spacing.2xl', px: 48 },
  { name: 'spacing.3xl', px: 64 },
] as const;

export const layoutSnippet = `/* Card shell — matches design-system pages */
<div className="rounded-xl border border-border bg-surface/50 p-4">
  ...
</div>

/* Token radius in plain CSS */
.my-panel {
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
}`;

export type ShapeScale = 'small' | 'medium' | 'big';

export type ShapeLanguageTier = {
  scale: ShapeScale;
  label: string;
  subtitle: string;
  radius: string;
  radiusClasses: string;
  padding: string;
  gap: string;
  shadow: string;
  examples: string[];
  guidance: string;
  avoid: string;
};

export const shapeLanguage: ShapeLanguageTier[] = [
  {
    scale: 'small',
    label: 'Small shape',
    subtitle: 'Micro surfaces — dense, tight, pill-like',
    radius: '4–12px',
    radiusClasses: 'rounded-md · rounded-lg · rounded-full',
    padding: 'p-2 · p-3',
    gap: 'gap-1.5 · gap-2',
    shadow: 'shadow-none · shadow-sm',
    examples: ['Chip', 'Tag', 'Facet label', 'Icon button', 'Badge'],
    guidance:
      'Corners stay subtle. Use full radius only for pills and circular controls — not for card-sized boxes.',
    avoid: 'Avoid rounded-2xl, heavy padding, or section-scale shadows on micro UI.',
  },
  {
    scale: 'medium',
    label: 'Medium shape',
    subtitle: 'Components — the default card and control language',
    radius: '12–16px',
    radiusClasses: 'rounded-lg · rounded-xl',
    padding: 'p-4 · p-5',
    gap: 'gap-3 · gap-4',
    shadow: 'shadow-sm · hover:shadow-md',
    examples: ['Content card', 'Button', 'Search field', 'List row', 'Do/don\u2019t row'],
    guidance:
      'This is the workhorse scale. Most interactive blocks use rounded-xl, border-border, and p-4.',
    avoid: 'Do not mix medium cards with small-radius inputs in the same component group.',
  },
  {
    scale: 'big',
    label: 'Big shape',
    subtitle: 'Sections — page regions and marketing shells',
    radius: '24–32px',
    radiusClasses: 'rounded-2xl · rounded-3xl',
    padding: 'p-6 · p-8 · py-10',
    gap: 'gap-6 · gap-8 · space-y-8',
    shadow: 'shadow-lg · soft gradient fills',
    examples: ['Hero panel', 'Design-system intro', 'Modal shell', 'Feature band', 'Sidebar card'],
    guidance:
      'Big shapes frame content — they should appear once or twice per viewport, not on every list item.',
    avoid:
      'Avoid big radius on chips or nested medium cards — nest medium inside big, not the reverse.',
  },
];

export const shapeNestingRule =
  'Nest outward: small inside medium inside big. A hero panel (big) contains cards (medium) contains chips (small). Never use a bigger radius on a child than its parent.';
