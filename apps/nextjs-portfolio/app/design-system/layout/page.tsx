'use client';

import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { LayoutLiveExamples } from '../components/demos/LayoutLiveExamples';
import { ReferenceDisclosure } from '../components/ReferenceDisclosure';
import {
  breakpoints,
  controlHeights,
  layoutPatterns,
  layoutSnippet,
  primitiveSpacing,
  radiusScale,
  shadowScale,
  spacingScale,
} from '../layout-data';

export default function LayoutPage() {
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
            Spacing uses Tailwind&apos;s scale (<code className='font-mono text-sm'>p-4</code>,{' '}
            <code className='font-mono text-sm'>gap-3</code>). Corner radius is token-backed —{' '}
            <code className='font-mono text-sm'>rounded-xl</code> maps to{' '}
            <code className='font-mono text-sm'>--radius-xl</code> from{' '}
            <code className='font-mono text-sm'>@wisihe/tokens</code>.
          </>
        }
      />

      <p className='mb-10 rounded-xl border border-border bg-surface/30 px-4 py-3 text-sm text-foreground-subtle'>
        <span className='font-medium text-foreground'>When to use which radius?</span> See{' '}
        <Link href='/design-system/principles' className='text-accent hover:underline'>
          Principles → Shape language
        </Link>{' '}
        for small (chips), medium (cards), and big (sections) — this page lists the token values.
      </p>

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
                <span
                  className='h-3 shrink-0 rounded-sm bg-accent'
                  style={{ width: `${Math.min(row.px * 2, 96)}px` }}
                  aria-hidden
                />
                <span className='min-w-[3rem] font-mono text-xs text-accent'>{row.token}</span>
                <span className='w-10 text-xs tabular-nums text-foreground-muted'>{row.px}px</span>
                <code className='hidden font-mono text-[10px] text-foreground-subtle sm:inline'>
                  {row.class}
                </code>
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
                className={`mb-3 h-14 w-full border-2 border-accent/60 bg-accent/10 ${row.class}`}
                aria-hidden
              />
              <div className='flex items-center justify-between gap-1'>
                <code className='font-mono text-xs text-foreground'>{row.class}</code>
                {copied === row.class ? (
                  <IconCheck className='size-3 text-success' stroke={2} aria-hidden />
                ) : null}
              </div>
              <p className='mt-1 text-[10px] text-foreground-muted'>
                {row.px != null ? `${row.px}px` : 'pill'} · {row.use}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Control heights</h2>
        <ul className='divide-y divide-border rounded-xl border border-border bg-surface/40 text-sm'>
          {controlHeights.map(row => (
            <li key={row.token}>
              <button
                type='button'
                onClick={() => copy(row.token)}
                className='flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-surface-hover/50'
              >
                <span
                  className={`${row.token} shrink-0 rounded-md border border-accent/40 bg-accent/15`}
                  aria-hidden
                />
                <code className='font-mono text-xs text-accent'>{row.token}</code>
                <span className='text-xs tabular-nums text-foreground-muted'>{row.px}px</span>
                <span className='ml-auto text-xs text-foreground-muted'>{row.use}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Common patterns</h2>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {layoutPatterns.map(pattern => (
            <button
              key={pattern.name}
              type='button'
              onClick={() => copy(pattern.classes)}
              className='rounded-xl border border-border bg-surface/50 p-4 text-left transition-colors hover:border-accent'
            >
              <p className='text-sm font-semibold text-foreground'>{pattern.name}</p>
              <code className='mt-2 block font-mono text-[10px] leading-relaxed text-foreground-muted'>
                {pattern.classes}
              </code>
              <p className='mt-2 text-xs text-foreground-subtle'>{pattern.note}</p>
            </button>
          ))}
        </div>
      </section>

      <ReferenceDisclosure title='Breakpoints, shadows & CSS variables'>
        <div className='space-y-8'>
          <div>
            <h3 className='mb-3 text-sm font-semibold text-foreground'>Breakpoints</h3>
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
          </div>
          <div>
            <h3 className='mb-3 text-sm font-semibold text-foreground'>Shadows</h3>
            <ul className='divide-y divide-border text-sm'>
              {shadowScale.map(row => (
                <li key={row.token} className='flex justify-between gap-4 py-2.5'>
                  <code className='font-mono text-xs text-foreground'>{row.token}</code>
                  <span className='text-foreground-muted'>{row.use}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='mb-3 text-sm font-semibold text-foreground'>Primitive spacing (CSS)</h3>
            <ul className='divide-y divide-border text-sm'>
              {primitiveSpacing.map(row => (
                <li key={row.name} className='flex justify-between gap-4 py-2.5'>
                  <code className='font-mono text-xs text-foreground-muted'>{row.name}</code>
                  <span className='tabular-nums text-foreground-muted'>{row.px}px</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='mb-3 text-sm font-semibold text-foreground'>Snippet</h3>
            <pre className='overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs text-foreground-subtle'>
              {layoutSnippet}
            </pre>
          </div>
        </div>
      </ReferenceDisclosure>

      <LayoutLiveExamples />
    </div>
  );
}
