import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';

const meta = {
  title: 'Tokens/Color',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Semantic colors (`--color-*` from `@wisihe/tokens`) and primitive scales. Toggle light/dark in the toolbar to compare themes. Swatches use CSS variables so they always match loaded tokens (not only Tailwind-generated utilities).',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Uses `var(--color-*)` so colors show even when Tailwind has not generated `bg-*` utilities for this file. */
function Swatch({ label, cssVar }: { label: string; cssVar: `--${string}` }) {
  return (
    <div className='flex min-w-[4.25rem] max-w-[6rem] flex-col gap-1.5'>
      <div
        className='h-14 w-full rounded-md border border-border shadow-sm'
        style={{ backgroundColor: `var(${cssVar})` }}
        title={label}
      />
      <span className='break-words font-mono text-[10px] leading-snug text-foreground-muted'>
        {label}
      </span>
    </div>
  );
}

function ScaleRow({
  title,
  swatches,
}: {
  title: string;
  swatches: readonly { label: string; cssVar: `--${string}` }[];
}) {
  return (
    <div className='mb-8'>
      <h3 className='mb-3 text-sm font-medium text-foreground'>{title}</h3>
      <div className='flex flex-wrap gap-3'>
        {swatches.map(s => (
          <Swatch key={s.label} label={s.label} cssVar={s.cssVar} />
        ))}
      </div>
    </div>
  );
}

const NEUTRAL_SCALE = [
  { label: 'neutral-50', cssVar: '--color-neutral-50' as const },
  { label: 'neutral-100', cssVar: '--color-neutral-100' as const },
  { label: 'neutral-200', cssVar: '--color-neutral-200' as const },
  { label: 'neutral-300', cssVar: '--color-neutral-300' as const },
  { label: 'neutral-400', cssVar: '--color-neutral-400' as const },
  { label: 'neutral-500', cssVar: '--color-neutral-500' as const },
  { label: 'neutral-600', cssVar: '--color-neutral-600' as const },
  { label: 'neutral-700', cssVar: '--color-neutral-700' as const },
  { label: 'neutral-800', cssVar: '--color-neutral-800' as const },
  { label: 'neutral-900', cssVar: '--color-neutral-900' as const },
  { label: 'neutral-950', cssVar: '--color-neutral-950' as const },
] as const;

const NEON_ORANGE_SCALE = [
  { label: 'neon-orange-50', cssVar: '--color-neon-orange-50' as const },
  { label: 'neon-orange-100', cssVar: '--color-neon-orange-100' as const },
  { label: 'neon-orange-200', cssVar: '--color-neon-orange-200' as const },
  { label: 'neon-orange-300', cssVar: '--color-neon-orange-300' as const },
  { label: 'neon-orange-400', cssVar: '--color-neon-orange-400' as const },
  { label: 'neon-orange-500', cssVar: '--color-neon-orange-500' as const },
  { label: 'neon-orange-600', cssVar: '--color-neon-orange-600' as const },
  { label: 'neon-orange-700', cssVar: '--color-neon-orange-700' as const },
  { label: 'neon-orange-800', cssVar: '--color-neon-orange-800' as const },
  { label: 'neon-orange-900', cssVar: '--color-neon-orange-900' as const },
  { label: 'neon-orange-950', cssVar: '--color-neon-orange-950' as const },
] as const;

const NEON_PINK_SCALE = [
  { label: 'neon-pink-50', cssVar: '--color-neon-pink-50' as const },
  { label: 'neon-pink-100', cssVar: '--color-neon-pink-100' as const },
  { label: 'neon-pink-200', cssVar: '--color-neon-pink-200' as const },
  { label: 'neon-pink-300', cssVar: '--color-neon-pink-300' as const },
  { label: 'neon-pink-400', cssVar: '--color-neon-pink-400' as const },
  { label: 'neon-pink-500', cssVar: '--color-neon-pink-500' as const },
  { label: 'neon-pink-600', cssVar: '--color-neon-pink-600' as const },
  { label: 'neon-pink-700', cssVar: '--color-neon-pink-700' as const },
  { label: 'neon-pink-800', cssVar: '--color-neon-pink-800' as const },
  { label: 'neon-pink-900', cssVar: '--color-neon-pink-900' as const },
  { label: 'neon-pink-950', cssVar: '--color-neon-pink-950' as const },
] as const;

function ColorsPage() {
  return (
    <div className='min-h-screen bg-background p-6 text-foreground md:p-10'>
      <div className='mx-auto max-w-6xl'>
        <header className='mb-10 border-b border-border pb-6'>
          <h1 className='text-2xl font-semibold tracking-tight'>Color tokens</h1>
          <p className='mt-2 max-w-2xl text-sm text-foreground-subtle'>
            Semantic tokens map to primitives; use Tailwind utilities such as{' '}
            <code className='rounded bg-surface px-1 py-0.5 font-mono text-xs'>bg-accent</code> in
            components.
          </p>
        </header>

        <section className='mb-12'>
          <h2 className='mb-4 text-lg font-semibold text-foreground'>Semantic</h2>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Swatch label='background' cssVar='--color-background' />
            <Swatch label='background-subtle' cssVar='--color-background-subtle' />
            <Swatch label='foreground' cssVar='--color-foreground' />
            <Swatch label='foreground-subtle' cssVar='--color-foreground-subtle' />
            <Swatch label='foreground-muted' cssVar='--color-foreground-muted' />
            <Swatch label='surface' cssVar='--color-surface' />
            <Swatch label='surface-hover' cssVar='--color-surface-hover' />
            <Swatch label='surface-subtle' cssVar='--color-surface-subtle' />
            <Swatch label='border' cssVar='--color-border' />
            <Swatch label='accent' cssVar='--color-accent' />
            <Swatch label='accent-hover' cssVar='--color-accent-hover' />
            <Swatch label='accent-contrast' cssVar='--color-accent-contrast' />
            <Swatch label='accent-subtle' cssVar='--color-accent-subtle' />
            <Swatch label='accent-text' cssVar='--color-accent-text' />
            <Swatch label='success' cssVar='--color-success' />
            <Swatch label='success-contrast' cssVar='--color-success-contrast' />
            <Swatch label='warning' cssVar='--color-warning' />
            <Swatch label='warning-contrast' cssVar='--color-warning-contrast' />
            <Swatch label='danger' cssVar='--color-danger' />
            <Swatch label='danger-contrast' cssVar='--color-danger-contrast' />
            <Swatch label='info' cssVar='--color-info' />
            <Swatch label='info-contrast' cssVar='--color-info-contrast' />
            <Swatch label='ring (focus)' cssVar='--color-ring' />
          </div>
        </section>

        <section className='mb-4'>
          <h2 className='mb-2 text-lg font-semibold text-foreground'>Primitives</h2>
          <p className='mb-6 text-sm text-foreground-subtle'>
            Full scales from <code className='font-mono text-xs'>@wisihe/tokens</code> primitives (
            <code className='font-mono text-xs'>--color-*</code>).
          </p>
          <ScaleRow title='Neutral' swatches={NEUTRAL_SCALE} />
          <ScaleRow title='Neon orange' swatches={NEON_ORANGE_SCALE} />
          <ScaleRow title='Neon pink' swatches={NEON_PINK_SCALE} />
        </section>
      </div>
    </div>
  );
}

export const Colors: Story = {
  render: () => <ColorsPage />,
};

type ColorDirection = {
  label: string;
  description: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  onAccent: string;
  accentLabel: string;
  contrastLabel: string;
};

const DIRECTIONS: readonly ColorDirection[] = [
  {
    label: 'Light · current',
    description: 'Electric blue on cool pale gray.',
    background: 'var(--color-cool-neutral-50)',
    surface: 'var(--color-neutral-white)',
    foreground: 'var(--color-neutral-900)',
    muted: 'var(--color-neutral-600)',
    border: 'var(--color-neutral-300)',
    accent: 'var(--color-brand-1-700)',
    accentText: 'var(--color-brand-1-700)',
    onAccent: 'var(--color-neutral-white)',
    accentLabel: 'brand-1-700 / neutral-white',
    contrastLabel: '6.70:1',
  },
  {
    label: 'Dark · current',
    description: 'Vivid pink on purple-tinted charcoal.',
    background: 'var(--color-plum-neutral-950)',
    surface: 'var(--color-plum-neutral-800)',
    foreground: 'var(--color-neutral-50)',
    muted: 'var(--color-neutral-300)',
    border: 'var(--color-plum-neutral-600)',
    accent: 'var(--color-neon-pink-400)',
    accentText: 'var(--color-neon-pink-400)',
    onAccent: 'var(--color-neutral-950)',
    accentLabel: 'neon-pink-400 / neutral-950',
    contrastLabel: '6.74:1',
  },
];

function DirectionPreview({ direction }: { direction: ColorDirection }) {
  const panelStyle: CSSProperties = {
    backgroundColor: direction.background,
    color: direction.foreground,
    borderColor: direction.border,
  };
  return (
    <article className='flex flex-col gap-4 rounded-lg border p-6' style={panelStyle}>
      <div>
        <h3 className='text-lg font-semibold'>{direction.label}</h3>
        <p className='mt-1 text-sm' style={{ color: direction.muted }}>
          {direction.description}
        </p>
      </div>
      <div
        className='rounded-lg border p-5'
        style={{ backgroundColor: direction.surface, borderColor: direction.border }}
      >
        <p className='text-sm font-semibold' style={{ color: direction.accentText }}>
          Featured project
        </p>
        <h4 className='mt-2 text-2xl font-semibold'>Design with purpose.</h4>
        <p className='mt-2 text-sm' style={{ color: direction.muted }}>
          Clear surfaces, readable type, and a distinct accent for each theme.
        </p>
        <button
          type='button'
          className='mt-5 rounded-md px-4 py-2 text-sm font-semibold'
          style={{ backgroundColor: direction.accent, color: direction.onAccent }}
        >
          View project
        </button>
      </div>
      <p className='text-sm' style={{ color: direction.muted }}>
        Fill / label: {direction.accentLabel} · {direction.contrastLabel}
      </p>
    </article>
  );
}

export const AccentDirections: Story = {
  render: () => (
    <main className='min-h-screen bg-background p-6 text-foreground md:p-10'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-2xl font-semibold'>Accent directions</h1>
        <p className='mt-2 max-w-3xl text-sm text-foreground-subtle'>
          Compare the light and dark palette directions. These examples use primitive tokens that
          back the semantic theme. Contrast ratios apply to the button fill and label only;
          interactive states and other contexts need separate checks.
        </p>
        <div className='mt-8 grid gap-4 md:grid-cols-2'>
          {DIRECTIONS.map(direction => (
            <DirectionPreview key={direction.label} direction={direction} />
          ))}
        </div>
        <p className='mt-6 text-sm text-foreground-subtle'>
          Suggested public names: accent, accent-hover, accent-active, accent-contrast, and
          accent-text. Use accent-text on surfaces; pair accent-contrast with the accent fill.
        </p>
      </div>
    </main>
  ),
};
