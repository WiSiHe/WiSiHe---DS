import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design Tokens/Colors',
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
