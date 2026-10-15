export const TOKENS_PACKAGE_VERSION = '1.1.0';

export const designSystemStack = [
  `@wisihe/tokens v${TOKENS_PACKAGE_VERSION}`,
  'Next.js 16',
  'Tailwind v4',
  '@teispace/next-themes',
  '@wisihe/ui-react',
  'Motion',
] as const;

export const STORYBOOK_URL = process.env.NEXT_PUBLIC_STORYBOOK_URL ?? 'http://localhost:6006';

/** Optional deep links into Storybook stories (path + query). */
export const storybookStoryPaths: Partial<Record<string, string>> = {
  PaintingCard: '/?path=/story/molecules-paintingcard--default',
};

type SemanticColor = {
  name: string;
  class: string;
  var: string;
  desc: string;
  bgClass?: string;
};

type SemanticGroup = {
  category: string;
  description: string;
  colors: SemanticColor[];
};

export const semanticColorGroups: SemanticGroup[] = [
  {
    category: 'Surface',
    description: 'Backgrounds, cards, and interactive surfaces.',
    colors: [
      {
        name: 'background',
        class: 'bg-background',
        var: 'var(--color-background)',
        desc: 'Page base',
      },
      {
        name: 'background-subtle',
        class: 'bg-background-subtle',
        var: 'var(--color-background-subtle)',
        desc: 'Tinted page base',
      },
      {
        name: 'surface',
        class: 'bg-surface',
        var: 'var(--color-surface)',
        desc: 'Card / panel',
      },
      {
        name: 'surface-subtle',
        class: 'bg-surface-subtle',
        var: 'var(--color-surface-subtle)',
        desc: 'Subtle surface',
      },
      {
        name: 'surface-hover',
        class: 'bg-surface-hover',
        var: 'var(--color-surface-hover)',
        desc: 'Hover surface',
      },
      {
        name: 'surface-active',
        class: 'bg-surface-active',
        var: 'var(--color-surface-active)',
        desc: 'Active / pressed surface',
      },
    ],
  },
  {
    category: 'Typography',
    description: 'Text hierarchy — prefer these over raw neutrals in UI.',
    colors: [
      {
        name: 'foreground',
        class: 'text-foreground',
        bgClass: 'bg-foreground',
        var: 'var(--color-foreground)',
        desc: 'Primary text',
      },
      {
        name: 'foreground-subtle',
        class: 'text-foreground-subtle',
        bgClass: 'bg-foreground-subtle',
        var: 'var(--color-foreground-subtle)',
        desc: 'Secondary text',
      },
      {
        name: 'foreground-muted',
        class: 'text-foreground-muted',
        bgClass: 'bg-foreground-muted',
        var: 'var(--color-foreground-muted)',
        desc: 'Tertiary / meta text',
      },
    ],
  },
  {
    category: 'Border & focus',
    description: 'Dividers, outlines, and focus rings.',
    colors: [
      {
        name: 'border',
        class: 'border-border',
        bgClass: 'bg-border',
        var: 'var(--color-border)',
        desc: 'Default border',
      },
      {
        name: 'border-subtle',
        class: 'border-border-subtle',
        bgClass: 'bg-border-subtle',
        var: 'var(--color-border-subtle)',
        desc: 'Low-contrast border',
      },
      {
        name: 'border-strong',
        class: 'border-border-strong',
        bgClass: 'bg-border-strong',
        var: 'var(--color-border-strong)',
        desc: 'High-contrast border',
      },
      {
        name: 'ring',
        class: 'ring-ring',
        bgClass: 'bg-ring',
        var: 'var(--color-ring)',
        desc: 'Focus ring (matches accent)',
      },
    ],
  },
  {
    category: 'Accent',
    description: 'Brand actions — neon-orange in light mode, neon-yellow in dark mode.',
    colors: [
      {
        name: 'accent',
        class: 'bg-accent',
        var: 'var(--color-accent)',
        desc: 'Primary action',
      },
      {
        name: 'accent-hover',
        class: 'bg-accent-hover',
        var: 'var(--color-accent-hover)',
        desc: 'Action hover',
      },
      {
        name: 'accent-active',
        class: 'bg-accent-active',
        var: 'var(--color-accent-active)',
        desc: 'Action pressed',
      },
      {
        name: 'accent-subtle',
        class: 'bg-accent-subtle',
        var: 'var(--color-accent-subtle)',
        desc: 'Tinted accent surface',
      },
      {
        name: 'accent-contrast',
        class: 'bg-accent-contrast',
        var: 'var(--color-accent-contrast)',
        desc: 'Text on accent',
      },
      {
        name: 'accent-border',
        class: 'border-accent-border',
        bgClass: 'bg-accent-border',
        var: 'var(--color-accent-border)',
        desc: 'Accent outline',
      },
    ],
  },
  {
    category: 'Feedback',
    description: 'Success, warning, danger, and info states.',
    colors: [
      {
        name: 'success',
        class: 'bg-success',
        var: 'var(--color-success)',
        desc: 'Success solid',
      },
      {
        name: 'success-subtle',
        class: 'bg-success-subtle',
        var: 'var(--color-success-subtle)',
        desc: 'Success surface',
      },
      {
        name: 'warning',
        class: 'bg-warning',
        var: 'var(--color-warning)',
        desc: 'Warning solid',
      },
      {
        name: 'warning-subtle',
        class: 'bg-warning-subtle',
        var: 'var(--color-warning-subtle)',
        desc: 'Warning surface',
      },
      {
        name: 'danger',
        class: 'bg-danger',
        var: 'var(--color-danger)',
        desc: 'Error / destructive',
      },
      {
        name: 'danger-subtle',
        class: 'bg-danger-subtle',
        var: 'var(--color-danger-subtle)',
        desc: 'Error surface',
      },
      {
        name: 'info',
        class: 'bg-info',
        var: 'var(--color-info)',
        desc: 'Informational',
      },
      {
        name: 'info-subtle',
        class: 'bg-info-subtle',
        var: 'var(--color-info-subtle)',
        desc: 'Info surface',
      },
    ],
  },
];

const SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

function primitiveScale(prefix: string, label: string) {
  return {
    name: label,
    colors: SHADES.map(shade => ({
      name: `${prefix}-${shade}`,
      value: `var(--color-${prefix}-${shade})`,
    })),
  };
}

export const primitiveScales = [
  primitiveScale('neutral', 'Neutral'),
  primitiveScale('neon-orange', 'Neon Orange (light accent source)'),
  primitiveScale('neon-yellow', 'Neon Yellow (dark accent source)'),
  primitiveScale('neon-pink', 'Neon Pink'),
  primitiveScale('brand-1', 'Brand 1 (Blue)'),
  primitiveScale('brand-2', 'Brand 2 (Violet)'),
  primitiveScale('brand-3', 'Brand 3 (Teal)'),
  primitiveScale('accent-legacy', 'Accent Legacy (Pink)'),
  primitiveScale('success-primitive', 'Success'),
  primitiveScale('warning-primitive', 'Warning'),
  primitiveScale('danger-primitive', 'Danger'),
  primitiveScale('info-primitive', 'Info'),
];

export const opacityLevels = [90, 75, 50, 25] as const;

export const fontFamilies = [
  {
    name: 'Inter',
    role: 'Body / UI',
    variable: '--font-inter',
    class: 'font-sans',
    sampleClass: 'font-sans',
    desc: 'Primary body text. Loaded via next/font in the root layout.',
  },
  {
    name: 'Geist Sans',
    role: 'Display variable',
    variable: '--font-geist-sans',
    class: 'font-serif',
    sampleClass: 'font-serif',
    desc: 'Used for headlines via font-serif. Base heading styles also reference --font-oswald as the intended display face.',
  },
  {
    name: 'Geist Mono',
    role: 'Code / data',
    variable: '--font-geist-mono',
    class: 'font-mono',
    sampleClass: 'font-mono',
    desc: 'Monospace for code snippets, labels, and metadata.',
  },
] as const;

export const fontSizes = [
  { name: 'xs', value: '0.75rem', class: 'text-xs' },
  { name: 'sm', value: '0.875rem', class: 'text-sm' },
  { name: 'base', value: '1rem', class: 'text-base' },
  { name: 'lg', value: '1.125rem', class: 'text-lg' },
  { name: 'xl', value: '1.25rem', class: 'text-xl' },
  { name: '2xl', value: '1.5rem', class: 'text-2xl' },
  { name: '3xl', value: '1.875rem', class: 'text-3xl' },
  { name: '4xl', value: '2.25rem', class: 'text-4xl' },
] as const;

export const fontWeights = [
  { name: 'Light', value: '300', class: 'font-light' },
  { name: 'Normal', value: '400', class: 'font-normal' },
  { name: 'Medium', value: '500', class: 'font-medium' },
  { name: 'Semi Bold', value: '600', class: 'font-semibold' },
  { name: 'Bold', value: '700', class: 'font-bold' },
] as const;

export const uiReactComponents = [
  { name: 'Badge', category: 'Atom' },
  { name: 'Button', category: 'Atom' },
  { name: 'Checkbox', category: 'Atom' },
  { name: 'Chip', category: 'Atom' },
  { name: 'IconBadge', category: 'Atom' },
  { name: 'Input', category: 'Atom' },
  { name: 'Skeleton', category: 'Atom' },
  { name: 'Spinner', category: 'Atom' },
  { name: 'Switch', category: 'Atom' },
  { name: 'Tag', category: 'Atom' },
  { name: 'Textarea', category: 'Atom' },
  { name: 'Breadcrumbs', category: 'Molecule' },
  { name: 'Card', category: 'Molecule' },
  { name: 'Combobox', category: 'Molecule' },
  { name: 'Dialog', category: 'Molecule' },
  { name: 'GlassSurface', category: 'Molecule' },
  { name: 'Pagination', category: 'Molecule' },
  { name: 'Popover', category: 'Molecule' },
  { name: 'Select', category: 'Molecule' },
  { name: 'SectionHeader', category: 'Molecule' },
  { name: 'Tabs', category: 'Molecule' },
  { name: 'PaintingCard', category: 'Molecule' },
  { name: 'ScrollGrowSection', category: 'Layout' },
] as const;
