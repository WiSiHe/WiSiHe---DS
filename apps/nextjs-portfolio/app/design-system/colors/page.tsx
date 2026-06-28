'use client';

import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { ColorLiveExamples } from '../components/demos/ColorLiveExamples';
import { ReferenceDisclosure } from '../components/ReferenceDisclosure';
import { opacityLevels, primitiveScales, semanticColorGroups } from '../token-data';

export default function ColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Colors'
        description={
          <>
            Use semantic tokens for UI. Accent is neon-orange in light mode, neon-yellow in dark.
            Primitives are for fixed illustrations and data viz only.
          </>
        }
      />

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Semantic tokens</h2>
        <div className='space-y-8'>
          {semanticColorGroups.map(group => (
            <div key={group.category}>
              <h3 className='mb-3 text-sm font-semibold text-foreground'>{group.category}</h3>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
                {group.colors.map(color => (
                  <button
                    key={color.name}
                    type='button'
                    onClick={() => copy(color.var, color.name)}
                    className='rounded-lg border border-border bg-surface/50 p-2.5 text-left transition-colors hover:border-accent'
                  >
                    <div
                      className={`mb-2 h-9 w-full rounded-md border border-border/10 ${color.bgClass ?? color.class}`}
                    />
                    <div className='flex items-center justify-between gap-1'>
                      <span className='text-xs font-medium text-foreground'>{color.name}</span>
                      {copiedColor === color.name ? (
                        <IconCheck className='size-3 text-success' stroke={2} aria-hidden />
                      ) : null}
                    </div>
                    <code className='mt-0.5 block truncate font-mono text-[10px] text-foreground-muted'>
                      {color.var}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ReferenceDisclosure title='Primitive scales & opacity'>
        <div className='space-y-6'>
          {primitiveScales.map(scale => (
            <div key={scale.name}>
              <p className='mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted'>
                {scale.name}
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {scale.colors.map(color => (
                  <button
                    key={color.name}
                    type='button'
                    title={color.name}
                    onClick={() => copy(color.value, color.name)}
                    className='size-8 rounded-md border border-border/40 transition-transform hover:scale-110 hover:border-accent'
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className='mb-2 text-xs font-medium uppercase tracking-wider text-foreground-muted'>
              Opacity modifiers
            </p>
            <div className='flex flex-wrap gap-3'>
              {opacityLevels.map(opacity => (
                <div key={opacity} className='flex items-center gap-2'>
                  <div className='relative h-8 w-12 overflow-hidden rounded border border-border bg-background'>
                    <div className={`absolute inset-0 bg-accent/${opacity}`} />
                  </div>
                  <code className='font-mono text-[10px] text-foreground-muted'>/{opacity}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReferenceDisclosure>

      <ColorLiveExamples />
    </div>
  );
}
