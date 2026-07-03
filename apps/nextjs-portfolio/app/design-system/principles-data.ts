export type DesignRule = {
  title: string;
  body: string;
  href?: string;
};

export const goldenRules: DesignRule[] = [
  {
    title: 'Semantic color only',
    body: 'UI uses bg-surface, text-foreground, border-border, bg-accent — never raw neutrals or hex in components.',
    href: '/design-system/colors',
  },
  {
    title: 'One icon system',
    body: '@tabler/icons-react everywhere. Sized by tier (size-3–size-8), stroke 2, currentColor.',
    href: '/design-system/iconography',
  },
  {
    title: 'Shared components first',
    body: 'Buttons, inputs, dialogs from @wisihe/ui-react. No one-off copies of the same pattern.',
    href: '/design-system/components',
  },
  {
    title: 'Accessible by default',
    body: 'Icon-only controls get aria-label on the button. Decorative SVGs get aria-hidden. Respect prefers-reduced-motion.',
    href: '/design-system/motion',
  },
  {
    title: 'Honest, direct copy',
    body: 'Say what happened and what to do next. No hype, no blame-the-user jokes.',
    href: '/design-system/tone-of-voice',
  },
];

/** @deprecated unused — goldenRules is canonical */
export const goldenRulesSummary = goldenRules;
