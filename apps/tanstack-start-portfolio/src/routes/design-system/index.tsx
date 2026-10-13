import type { TablerIcon } from '@tabler/icons-react';
import {
  IconArrowRight,
  IconBolt,
  IconBoxPadding,
  IconExternalLink,
  IconIcons,
  IconPalette,
  IconRuler2,
  IconSpeakerphone,
  IconStack2,
  IconTypography,
} from '@tabler/icons-react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { STORYBOOK_URL, TOKENS_PACKAGE_VERSION } from '../../lib/design-system/token-data';
import { buildHead } from '../../lib/seo';

type SectionLink = {
  title: string;
  description: string;
  href: string;
  icon: TablerIcon;
};

const sectionGroups: { label: string; items: SectionLink[] }[] = [
  {
    label: 'Foundations',
    items: [
      {
        title: 'Principles',
        description: 'Five rules and shape language (small / medium / big).',
        href: '/design-system/principles',
        icon: IconRuler2,
      },
      {
        title: 'Colors',
        description: 'Semantic tokens and when to use primitives.',
        href: '/design-system/colors',
        icon: IconPalette,
      },
      {
        title: 'Typography',
        description: 'Inter, Geist, scale, weights.',
        href: '/design-system/typography',
        icon: IconTypography,
      },
      {
        title: 'Layout',
        description: 'Spacing, radius, control heights.',
        href: '/design-system/layout',
        icon: IconBoxPadding,
      },
      {
        title: 'Iconography',
        description: 'Tabler — size tiers and stroke.',
        href: '/design-system/iconography',
        icon: IconIcons,
      },
    ],
  },
  {
    label: 'Patterns & voice',
    items: [
      {
        title: 'Motion',
        description: 'Timing, libraries, reduced motion.',
        href: '/design-system/motion',
        icon: IconBolt,
      },
      {
        title: 'Components',
        description: '@wisihe/ui-react — see Storybook for variants.',
        href: '/design-system/components',
        icon: IconStack2,
      },
      {
        title: 'Tone of voice',
        description: 'UI copy do/don\u2019t examples.',
        href: '/design-system/tone-of-voice',
        icon: IconSpeakerphone,
      },
    ],
  },
];

function SectionCard({ item }: { item: SectionLink }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className='group relative flex items-start gap-4 overflow-hidden rounded-xl border border-border/80 bg-surface/40 p-4 transition-all duration-200 hover:border-accent/40 hover:bg-surface hover:shadow-sm'
    >
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-accent-contrast'>
        <Icon className='size-5' stroke={2} aria-hidden />
      </div>
      <div className='min-w-0 flex-1 pt-0.5'>
        <h3 className='font-semibold text-foreground transition-colors group-hover:text-accent'>
          {item.title}
        </h3>
        <p className='mt-1 text-sm leading-relaxed text-foreground-subtle'>{item.description}</p>
      </div>
      <IconArrowRight
        className='mt-1 size-4 shrink-0 text-foreground-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100'
        stroke={2}
        aria-hidden
      />
    </Link>
  );
}

export const Route = createFileRoute('/design-system/')({
  head: () =>
    buildHead({
      title: 'Design System | WiSiHe',
      description: 'Design tokens and UI patterns for the WiSiHe portfolio.',
      path: '/design-system',
      noIndex: true,
    }),
  component: DesignSystemIntro,
});

function DesignSystemIntro() {
  return (
    <div className='md:px-0'>
      <section className='relative mb-10 overflow-hidden rounded-2xl border border-border bg-surface/30'>
        <div
          className='pointer-events-none absolute inset-0 bg-linear-to-br from-accent/15 via-transparent to-transparent'
          aria-hidden
        />
        <div className='relative px-6 py-8 md:px-8 md:py-10'>
          <span className='rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent'>
            @wisihe/tokens v{TOKENS_PACKAGE_VERSION}
          </span>

          <h1 className='mt-4 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
            Design <span className='text-accent'>system</span>
          </h1>
          <p className='mt-3 max-w-lg text-base leading-relaxed text-foreground-subtle'>
            Tokens and patterns for this site. Semantic colors, shared components, light/dark via{' '}
            <code className='rounded bg-background/80 px-1.5 py-0.5 font-mono text-sm text-foreground'>
              @teispace/next-themes
            </code>
            .
          </p>

          <Link
            to='/design-system/principles'
            className='mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline'
          >
            Start with principles
            <IconArrowRight className='size-4' stroke={2} aria-hidden />
          </Link>
        </div>
      </section>

      {sectionGroups.map(group => (
        <section key={group.label} className='mb-10'>
          <h2 className='mb-4 text-xs font-bold uppercase tracking-widest text-foreground-muted'>
            {group.label}
          </h2>
          <nav
            className='grid grid-cols-1 gap-3 sm:grid-cols-2'
            aria-label={`${group.label} sections`}
          >
            {group.items.map(item => (
              <SectionCard key={item.href} item={item} />
            ))}
          </nav>
        </section>
      ))}

      <footer className='rounded-2xl border border-border/80 bg-surface/20 px-5 py-4'>
        <a
          href={STORYBOOK_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1.5 text-sm text-accent hover:underline'
        >
          Storybook — component variants and a11y
          <IconExternalLink className='size-3.5' stroke={2} aria-hidden />
        </a>
      </footer>
    </div>
  );
}
