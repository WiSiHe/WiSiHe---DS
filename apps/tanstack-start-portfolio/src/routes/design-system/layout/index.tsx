import { IconCheck } from '@tabler/icons-react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../../../components/design-system/DesignSystemPageHeader';
import { ReferenceDisclosure } from '../../../components/design-system/ReferenceDisclosure';
import {
  breakpoints,
  controlHeights,
  radiusScale,
  shadowScale,
  spacingScale,
} from '../../../lib/design-system/layout-data';
import { buildHead } from '../../../lib/seo';

export const Route = createFileRoute('/design-system/layout/')({
  head: () =>
    buildHead({
      title: 'Layout | Design System | WiSiHe',
      description: 'Spacing, border radius, control heights, and breakpoints.',
      path: '/design-system/layout',
      noIndex: true,
    }),
  component: LayoutPage,
});

function LayoutPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Layout'
        description={
          <>
            Tailwind spacing and token-backed radius. Shape scale:{' '}
            <Link to='/design-system/principles' className='text-accent hover:underline'>
              Principles
            </Link>
            .
          </>
        }
      />

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Spacing</h2>
        <ul className='divide-y divide-border rounded-xl border border-border bg-surface/40'>
          {spacingScale.map(row => (
            <li key={row.token}>
              <button
                type='button'
                onClick={() => copy(`p-${row.token}`)}
                className='flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-hover/50'
              >
                <span className='min-w-[3rem] font-mono text-xs text-accent'>{row.token}</span>
                <span className='w-10 text-xs tabular-nums text-foreground-muted'>{row.px}px</span>
                <span className='ml-auto text-right text-xs text-foreground-muted'>{row.use}</span>
                {copied === `p-${row.token}` ? (
                  <IconCheck className='size-3 shrink-0 text-success' stroke={2} aria-hidden />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Border radius</h2>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
          {radiusScale.map(row => (
            <button
              key={row.token}
              type='button'
              onClick={() => copy(row.class)}
              className='rounded-xl border border-border bg-surface/50 p-3 text-left transition-colors hover:border-accent'
            >
              <div
                className={`mb-3 h-12 w-full border-2 border-accent/60 bg-accent/10 ${row.class}`}
                aria-hidden
              />
              <code className='font-mono text-xs text-foreground'>{row.class}</code>
              <p className='mt-1 text-[10px] text-foreground-muted'>{row.use}</p>
            </button>
          ))}
        </div>
      </section>

      <ReferenceDisclosure title='Breakpoints, control heights & shadows'>
        <div className='space-y-6'>
          <ul className='divide-y divide-border text-sm'>
            {breakpoints.map(bp => (
              <li key={bp.name} className='flex justify-between gap-4 py-2.5'>
                <code className='font-mono text-xs text-accent'>{bp.name}</code>
                <span className='text-foreground-muted'>
                  {bp.px}px — {bp.use}
                </span>
              </li>
            ))}
          </ul>
          <ul className='divide-y divide-border text-sm'>
            {controlHeights.map(row => (
              <li key={row.token} className='flex justify-between gap-4 py-2.5'>
                <code className='font-mono text-xs text-accent'>{row.token}</code>
                <span className='text-foreground-muted'>
                  {row.px}px — {row.use}
                </span>
              </li>
            ))}
          </ul>
          <ul className='divide-y divide-border text-sm'>
            {shadowScale.map(row => (
              <li key={row.token} className='flex justify-between gap-4 py-2.5'>
                <code className='font-mono text-xs text-foreground'>{row.token}</code>
                <span className='text-foreground-muted'>{row.use}</span>
              </li>
            ))}
          </ul>
        </div>
      </ReferenceDisclosure>
    </div>
  );
}
