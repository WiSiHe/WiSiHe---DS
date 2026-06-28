'use client';

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
import Link from 'next/link';
import { goldenRulesSummary } from './principles-data';
import { designSystemStack, STORYBOOK_URL, TOKENS_PACKAGE_VERSION } from './token-data';

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
        description: 'Golden rules and small / medium / big shape language.',
        href: '/design-system/principles',
        icon: IconRuler2,
      },
      {
        title: 'Colors',
        description: 'Semantic tokens, primitives, and theme-aware usage.',
        href: '/design-system/colors',
        icon: IconPalette,
      },
      {
        title: 'Typography',
        description: 'Inter, Geist, scale, and hierarchy.',
        href: '/design-system/typography',
        icon: IconTypography,
      },
      {
        title: 'Layout',
        description: 'Spacing scale, border radius, and control sizes.',
        href: '/design-system/layout',
        icon: IconBoxPadding,
      },
      {
        title: 'Iconography',
        description: 'Tabler icons — size tiers, stroke, and scaling.',
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
        description: 'Timing, libraries, and live do/don\u2019t demos.',
        href: '/design-system/motion',
        icon: IconBolt,
      },
      {
        title: 'Components',
        description: '@wisihe/ui-react — details in Storybook.',
        href: '/design-system/components',
        icon: IconStack2,
      },
      {
        title: 'Tone of voice',
        description: 'Clear, honest UI copy.',
        href: '/design-system/tone-of-voice',
        icon: IconSpeakerphone,
      },
    ],
  },
];

const heroPills = [
  'Semantic color',
  'Light / dark',
  'Tabler icons',
  'Live do & don\u2019t',
] as const;

function SectionCard({ item }: { item: SectionLink }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
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

export default function DesignSystemIntro() {
  return (
    <div className='md:px-0'>
      {/* Hero */}
      <section className='relative mb-10 overflow-hidden rounded-2xl border border-border bg-surface/30'>
        <div
          className='pointer-events-none absolute inset-0 bg-linear-to-br from-accent/15 via-transparent to-transparent'
          aria-hidden
        />
        <div
          className='pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/20 blur-3xl'
          aria-hidden
        />
        <div
          className='pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-foreground/5 blur-3xl'
          aria-hidden
        />

        <div className='relative px-6 py-8 md:px-8 md:py-10'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent'>
              @wisihe/tokens v{TOKENS_PACKAGE_VERSION}
            </span>
            <span className='rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] text-foreground-muted'>
              WiSiHe portfolio
            </span>
          </div>

          <h1 className='mt-4 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
            Design <span className='text-accent'>system</span>
          </h1>
          <p className='mt-3 max-w-xl text-base leading-relaxed text-foreground-subtle'>
            Tokens and patterns for this site — semantic colors, type, layout, and components that
            adapt to light and dark via{' '}
            <code className='rounded bg-background/80 px-1.5 py-0.5 font-mono text-sm text-foreground'>
              @teispace/next-themes
            </code>
            .
          </p>

          <ul className='mt-5 flex flex-wrap gap-2' aria-label='Highlights'>
            {heroPills.map(pill => (
              <li
                key={pill}
                className='rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-foreground-muted'
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>

        <div className='flex h-1 border-t border-border/50' aria-hidden>
          <span className='flex-1 bg-accent' />
          <span className='flex-1 bg-foreground-subtle' />
          <span className='flex-1 bg-foreground-muted' />
          <span className='flex-1 bg-border' />
          <span className='flex-1 bg-surface-hover' />
        </div>
      </section>

      {/* Golden rules + principles CTA */}
      <section className='mb-10 grid grid-cols-1 gap-4 lg:grid-cols-5'>
        <div className='rounded-2xl border border-accent/25 bg-accent/5 p-5 lg:col-span-3'>
          <div className='mb-4 flex items-center gap-2'>
            <span className='flex size-8 items-center justify-center rounded-lg bg-accent text-accent-contrast'>
              <IconRuler2 className='size-4' stroke={2} aria-hidden />
            </span>
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider text-accent'>
                Golden rules
              </h2>
              <p className='text-xs text-foreground-muted'>Non-negotiable — always apply.</p>
            </div>
          </div>
          <ol className='space-y-3'>
            {goldenRulesSummary.map((rule, index) => (
              <li key={rule.title} className='flex gap-3 text-sm'>
                <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-[10px] font-bold text-accent'>
                  {index + 1}
                </span>
                <p className='leading-relaxed text-foreground-subtle'>
                  <span className='font-medium text-foreground'>{rule.title}.</span> {rule.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href='/design-system/principles'
          className='group flex flex-col justify-between rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:border-accent/40 hover:bg-surface lg:col-span-2'
        >
          <div>
            <p className='font-mono text-[10px] uppercase tracking-wider text-foreground-muted'>
              Full framework
            </p>
            <h2 className='mt-2 font-serif text-2xl font-bold text-foreground'>Principles</h2>
            <p className='mt-2 text-sm leading-relaxed text-foreground-subtle'>
              Golden rules plus shape language — how corners and padding scale from chips (small) to
              cards (medium) to hero bands (big).
            </p>
          </div>
          <span className='mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent'>
            Shape language & rules
            <IconArrowRight
              className='size-4 transition-transform group-hover:translate-x-0.5'
              stroke={2}
              aria-hidden
            />
          </span>
        </Link>
      </section>

      {/* Section groups */}
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

      {/* Footer */}
      <footer className='rounded-2xl border border-border/80 bg-surface/20 px-5 py-5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-xs font-medium text-foreground'>Storybook</p>
            <a
              href={STORYBOOK_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-1 inline-flex items-center gap-1.5 text-sm text-accent hover:underline'
            >
              {STORYBOOK_URL.replace(/^https?:\/\//, '')}
              <IconExternalLink className='size-3.5' stroke={2} aria-hidden />
            </a>
            <p className='mt-1 text-xs text-foreground-muted'>
              Run <code className='font-mono'>pnpm storybook</code> locally
            </p>
          </div>
          <div className='flex flex-wrap gap-1.5'>
            {designSystemStack.map(item => (
              <span
                key={item}
                className='rounded-md border border-border/60 bg-background/50 px-2 py-1 font-mono text-[10px] text-foreground-muted'
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
