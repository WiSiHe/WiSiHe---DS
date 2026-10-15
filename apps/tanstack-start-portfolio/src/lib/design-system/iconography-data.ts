export const iconLibraries = [
  {
    name: '@tabler/icons-react',
    when: 'All UI icons — @wisihe/ui-react, app shell, marketing, search',
  },
  {
    name: 'Custom SVG',
    when: 'Brand mark only (IconLogo)',
  },
] as const;

/** Named tiers — use these instead of arbitrary pixel sizes. */
export const iconSizeScale = [
  {
    tier: 'xs',
    token: 'size-3',
    px: 12,
    stroke: 1.75,
    text: 'text-xs',
    gap: 'gap-1.5',
    use: 'Footer meta, external-link chevrons, facet chips',
  },
  {
    tier: 'sm',
    token: 'size-4',
    px: 16,
    stroke: 2,
    text: 'text-sm',
    gap: 'gap-2',
    use: 'Inline with body copy, links, @wisihe/ui-react button icons',
  },
  {
    tier: 'md',
    token: 'size-5',
    px: 20,
    stroke: 2,
    text: 'text-sm / text-base',
    gap: 'gap-3',
    use: 'Default — nav controls, search fields, size-10 icon buttons',
  },
  {
    tier: 'lg',
    token: 'size-6',
    px: 24,
    stroke: 2,
    text: 'text-base / text-lg',
    gap: 'gap-3',
    use: 'Dock nav, carousel arrows, marketing rows',
  },
  {
    tier: 'xl',
    token: 'size-8',
    px: 32,
    stroke: 2,
    text: 'text-lg+',
    gap: 'gap-4',
    use: 'Hero accents only — one per viewport region max',
  },
] as const;

export const tablerIconSamples = [
  'IconArrowRight',
  'IconChevronDown',
  'IconCheck',
  'IconSearch',
  'IconX',
  'IconBrush',
  'IconFolder',
  'IconUser',
] as const;

export const iconSnippet = `import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { Button } from '@wisihe/ui-react';

// sm — inline with text-sm
<p className="flex items-center gap-2 text-sm">
  <IconArrowRight className="size-4 shrink-0" stroke={2} aria-hidden />
  Read more
</p>

// md — default control
<button type="button" className="inline-flex size-10 items-center justify-center" aria-label="Search">
  <IconSearch className="size-5 shrink-0" stroke={2} aria-hidden />
</button>

// @wisihe/ui-react — icon size handled by Button
<Button variant="primary" Icon={IconArrowRight} iconPosition="right">
  View work
</Button>`;
