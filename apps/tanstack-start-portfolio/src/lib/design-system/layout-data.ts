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

export type ShapeScale = 'small' | 'medium' | 'big';

export type ShapeLanguageTier = {
  scale: ShapeScale;
  label: string;
  radius: string;
  radiusClasses: string;
  padding: string;
  gap: string;
  shadow: string;
  guidance: string;
};

export const shapeLanguage: ShapeLanguageTier[] = [
  {
    scale: 'small',
    label: 'Small',
    radius: '4–12px',
    radiusClasses: 'rounded-md · rounded-lg · rounded-full',
    padding: 'p-2 · p-3',
    gap: 'gap-1.5 · gap-2',
    shadow: 'shadow-none · shadow-sm',
    guidance:
      'Micro UI — subtle corners. Full radius only for pills and circles, not card-sized boxes.',
  },
  {
    scale: 'medium',
    label: 'Medium',
    radius: '12–16px',
    radiusClasses: 'rounded-lg · rounded-xl',
    padding: 'p-4 · p-5',
    gap: 'gap-3 · gap-4',
    shadow: 'shadow-sm · hover:shadow-md',
    guidance: 'Default for interactive blocks — rounded-xl, border-border, p-4.',
  },
  {
    scale: 'big',
    label: 'Big',
    radius: '24–32px',
    radiusClasses: 'rounded-2xl · rounded-3xl',
    padding: 'p-6 · p-8 · py-10',
    gap: 'gap-6 · gap-8 · space-y-8',
    shadow: 'shadow-lg · soft gradient fills',
    guidance:
      'Page regions — once or twice per viewport. Nest medium inside big; never bigger radius on a child.',
  },
];

export const shapeNestingRule =
  'Nest outward: small inside medium inside big. Child corners stay equal or tighter than the parent.';
