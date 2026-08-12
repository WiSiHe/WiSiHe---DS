import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHero } from '../components/layout/PageHero';
import { buildHead } from '../lib/seo';

export const Route = createFileRoute('/design-system')({
  head: () =>
    buildHead({
      title: 'Design System | WiSiHe',
      description: 'Design tokens and UI patterns for the WiSiHe portfolio.',
      path: '/design-system',
      noIndex: true,
    }),
  component: DesignSystemPage,
});

function DesignSystemPage() {
  return (
    <div className='container mx-auto max-w-3xl px-4 pt-32 pb-20'>
      <PageHero
        eyebrow='Internal'
        title='Design system'
        description='Token-driven UI shared across WiSiHe apps via @wisihe/tokens and @wisihe/ui-react.'
      />
      <div className='space-y-4 rounded-2xl border border-border bg-surface p-6'>
        <p className='text-foreground/70'>
          The full interactive design-system docs currently live in the Next.js portfolio and
          Storybook. This TanStack app consumes the same packages.
        </p>
        <ul className='list-disc space-y-2 pl-5 text-foreground/70'>
          <li>
            <code className='rounded bg-surface-subtle px-1.5 py-0.5 text-sm'>@wisihe/tokens</code>{' '}
            — colors, spacing, semantic CSS
          </li>
          <li>
            <code className='rounded bg-surface-subtle px-1.5 py-0.5 text-sm'>
              @wisihe/ui-react
            </code>{' '}
            — Button, Card, Chip, Tag, and more
          </li>
        </ul>
        <Link to='/' className='inline-block text-accent hover:underline'>
          ← Back home
        </Link>
      </div>
    </div>
  );
}
