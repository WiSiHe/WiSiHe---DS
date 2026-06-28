'use client';

import {
  IconArrowRight,
  IconBrush,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleX,
  IconDeviceTv,
  IconEye,
  IconFilter,
  IconFolder,
  IconHeart,
  IconMapPin,
  IconSearch,
  IconShare,
  IconShoppingCart,
  IconUser,
  IconVideo,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { IconographyLiveExamples } from '../components/demos/IconographyLiveExamples';
import { ReferenceDisclosure } from '../components/ReferenceDisclosure';
import {
  appShellIconSamples,
  iconLibraries,
  iconScalingRules,
  iconSizeScale,
  iconSnippet,
  tablerIconSamples,
} from '../iconography-data';

const tablerIcons: Record<(typeof tablerIconSamples)[number], typeof IconSearch> = {
  IconArrowRight,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconSearch,
  IconX,
  IconShoppingCart,
  IconMapPin,
  IconVideo,
  IconBrush,
  IconFolder,
  IconDeviceTv,
  IconUser,
  IconEye,
  IconHeart,
  IconShare,
};

const appShellIconComponents: Record<string, typeof IconSearch> = {
  IconBrush,
  IconFolder,
  IconDeviceTv,
  IconUser,
  IconSearch,
  IconCircleX,
  IconFilter,
  IconEye,
  IconHeart,
  IconShare,
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
            <code className='font-mono text-sm'>@tabler/icons-react</code> only. Size by tier (
            <code className='font-mono text-sm'>size-3</code>–
            <code className='font-mono text-sm'>size-8</code>), scale with adjacent text,{' '}
            <code className='font-mono text-sm'>stroke=2</code> default.
          </>
        }
      />

      <section className='mb-12'>
        <h2 className='mb-1 text-lg font-bold text-foreground'>Size scale</h2>
        <p className='mb-4 text-sm text-foreground-muted'>
          Five named tiers — pick one per context. Do not use arbitrary sizes between them.
        </p>
        <div className='divide-y divide-border rounded-xl border border-border bg-surface/40'>
          {iconSizeScale.map(row => (
            <div key={row.tier} className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center'>
              <div className='flex min-w-[7rem] items-center gap-3'>
                <IconSearch
                  className={`${row.token} shrink-0 text-foreground`}
                  stroke={row.stroke}
                  aria-hidden
                />
                <div>
                  <p className='font-mono text-xs font-semibold uppercase text-accent'>
                    {row.tier}
                  </p>
                  <button
                    type='button'
                    onClick={() => copy(row.token)}
                    className='font-mono text-[10px] text-foreground-muted hover:text-accent'
                  >
                    {row.token}
                    {copied === row.token ? ' ✓' : ''}
                  </button>
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-foreground-muted sm:flex-1'>
                <span>{row.px}px</span>
                <span>stroke {row.stroke}</span>
                <span>{row.text}</span>
                <span>{row.gap}</span>
              </div>
              <p className='text-xs text-foreground-subtle sm:max-w-[14rem] sm:text-right'>
                {row.use}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Scale with text</h2>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {iconSizeScale.slice(0, 3).map(row => (
            <div
              key={row.tier}
              className={`flex items-center rounded-xl border border-border bg-surface/50 px-4 py-3 ${row.gap}`}
            >
              <IconArrowRight
                className={`${row.token} shrink-0 text-accent`}
                stroke={row.stroke}
                aria-hidden
              />
              <span className={row.text}>Label at {row.tier} tier</span>
            </div>
          ))}
        </div>
        <p className='mt-3 text-xs text-foreground-muted'>
          xs + text-xs · sm + text-sm · md + text-sm/base — keep icon and copy on the same tier.
        </p>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Scaling rules</h2>
        <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {iconScalingRules.map(rule => (
            <li key={rule.title} className='rounded-xl border border-border bg-surface/40 p-4'>
              <h3 className='text-sm font-semibold text-foreground'>{rule.title}</h3>
              <p className='mt-1 text-sm text-foreground-subtle'>{rule.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Common icons</h2>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-5'>
          {tablerIconSamples.map(name => {
            const Icon = tablerIcons[name];
            return (
              <div
                key={name}
                className='flex flex-col items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-4'
              >
                <Icon className='size-5 text-foreground' stroke={2} aria-hidden />
                <code className='font-mono text-[9px] text-foreground-muted'>{name}</code>
              </div>
            );
          })}
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>App shell (by tier)</h2>
        <div className='space-y-4'>
          {appShellIconSamples.map(group => {
            const scale = iconSizeScale.find(row => row.tier === group.tier);
            const token = scale?.token ?? 'size-5';
            const stroke = scale?.stroke ?? 2;
            return (
              <div key={group.group}>
                <p className='mb-2 text-xs text-foreground-muted'>
                  {group.group}{' '}
                  <span className='font-mono text-accent'>
                    · {group.tier} ({token})
                  </span>
                </p>
                <div className='flex flex-wrap gap-2'>
                  {group.names.map(name => {
                    const Icon = appShellIconComponents[name];
                    if (!Icon) return null;
                    return (
                      <div
                        key={name}
                        className='flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-3 py-2 text-foreground'
                      >
                        <Icon className={`${token} shrink-0`} stroke={stroke} aria-hidden />
                        <code className='font-mono text-[9px] text-foreground-muted'>{name}</code>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ReferenceDisclosure title='Library & code snippet'>
        <div className='space-y-8'>
          <ul className='divide-y divide-border text-sm'>
            {iconLibraries.map(lib => (
              <li
                key={lib.name}
                className='flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between'
              >
                <code className='font-mono text-xs text-accent'>{lib.name}</code>
                <span className='text-foreground-muted'>{lib.when}</span>
              </li>
            ))}
          </ul>
          <pre className='overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs text-foreground-subtle'>
            {iconSnippet}
          </pre>
        </div>
      </ReferenceDisclosure>

      <IconographyLiveExamples />
    </div>
  );
}
