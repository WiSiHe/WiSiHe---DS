'use client';

import {
  IconArrowRight,
  IconBrush,
  IconCheck,
  IconChevronDown,
  IconFolder,
  IconSearch,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { IconographyLiveExamples } from '../components/demos/IconographyLiveExamples';
import { ReferenceDisclosure } from '../components/ReferenceDisclosure';
import { iconLibraries, iconSizeScale, iconSnippet, tablerIconSamples } from '../iconography-data';

const tablerIcons: Record<(typeof tablerIconSamples)[number], typeof IconSearch> = {
  IconArrowRight,
  IconChevronDown,
  IconCheck,
  IconSearch,
  IconX,
  IconBrush,
  IconFolder,
  IconUser,
};

export default function IconographyPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Iconography'
        description={
          <>
            <code className='font-mono text-sm'>@tabler/icons-react</code> — five size tiers (
            <code className='font-mono text-sm'>size-3</code>–
            <code className='font-mono text-sm'>size-8</code>),{' '}
            <code className='font-mono text-sm'>stroke=2</code>,{' '}
            <code className='font-mono text-sm'>shrink-0</code> in flex rows.
          </>
        }
      />

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Size scale</h2>
        <div className='divide-y divide-border rounded-xl border border-border bg-surface/40'>
          {iconSizeScale.map(row => (
            <div key={row.tier} className='flex items-center gap-4 p-4'>
              <IconSearch
                className={`${row.token} shrink-0 text-foreground`}
                stroke={row.stroke}
                aria-hidden
              />
              <button
                type='button'
                onClick={() => copy(row.token)}
                className='min-w-[4rem] text-left font-mono text-xs font-semibold uppercase text-accent hover:underline'
              >
                {row.tier} · {row.token}
                {copied === row.token ? ' ✓' : ''}
              </button>
              <span className='ml-auto text-right text-xs text-foreground-muted'>{row.use}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Common icons</h2>
        <div className='grid grid-cols-4 gap-2 sm:grid-cols-8'>
          {tablerIconSamples.map(name => {
            const Icon = tablerIcons[name];
            return (
              <div
                key={name}
                className='flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface/50 px-2 py-3'
              >
                <Icon className='size-5 text-foreground' stroke={2} aria-hidden />
                <code className='font-mono text-[8px] text-foreground-muted'>{name}</code>
              </div>
            );
          })}
        </div>
      </section>

      <ReferenceDisclosure title='Snippet'>
        <pre className='overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs text-foreground-subtle'>
          {iconSnippet}
        </pre>
        <ul className='mt-4 divide-y divide-border text-sm'>
          {iconLibraries.map(lib => (
            <li
              key={lib.name}
              className='flex flex-col gap-0.5 py-2 sm:flex-row sm:justify-between'
            >
              <code className='font-mono text-xs text-accent'>{lib.name}</code>
              <span className='text-foreground-muted'>{lib.when}</span>
            </li>
          ))}
        </ul>
      </ReferenceDisclosure>

      <IconographyLiveExamples />
    </div>
  );
}
