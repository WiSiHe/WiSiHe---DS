import { IconCheck } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { DesignSystemPageHeader } from '../../../components/design-system/DesignSystemPageHeader';
import { TypographyLiveExamples } from '../../../components/design-system/demos/TypographyLiveExamples';
import { ReferenceDisclosure } from '../../../components/design-system/ReferenceDisclosure';
import { fontFamilies, fontSizes, fontWeights } from '../../../lib/design-system/token-data';
import { buildHead } from '../../../lib/seo';

export const Route = createFileRoute('/design-system/typography/')({
  head: () =>
    buildHead({
      title: 'Typography | Design System | WiSiHe',
      description: 'Typography scales, fonts, and weights in the WiSiHe design system.',
      path: '/design-system/typography',
      noIndex: true,
    }),
  component: TypographyPage,
});

function TypographyPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Typography'
        description={
          <>
            Inter for body (default). <code className='font-mono text-sm'>font-serif</code> for
            display headings. <code className='font-mono text-sm'>font-mono</code> for code. h1–h3
            use fluid clamp in globals.css.
          </>
        }
      />

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Typefaces</h2>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {fontFamilies.map(font => (
            <button
              key={font.name}
              type='button'
              onClick={() => copy(font.variable)}
              className='rounded-xl border border-border bg-surface/50 p-4 text-left transition-colors hover:border-accent'
            >
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted'>
                  {font.role}
                </span>
                {copied === font.variable ? (
                  <IconCheck className='size-3 text-success' stroke={2} aria-hidden />
                ) : null}
              </div>
              <p className={`${font.sampleClass} text-2xl text-foreground`}>{font.name}</p>
              <code className='mt-2 block font-mono text-[10px] text-foreground-muted'>
                {font.variable}
              </code>
            </button>
          ))}
        </div>
      </section>

      <ReferenceDisclosure title='Scale & weights'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <ul className='divide-y divide-border text-sm'>
            {[...fontSizes].reverse().map(size => (
              <li key={size.name}>
                <button
                  type='button'
                  onClick={() => copy(`text-${size.name}`)}
                  className='flex w-full items-baseline justify-between py-2.5 text-left hover:text-accent'
                >
                  <span className={`${size.class} text-foreground`}>Ag</span>
                  <code className='font-mono text-xs text-foreground-muted'>text-{size.name}</code>
                </button>
              </li>
            ))}
          </ul>
          <ul className='divide-y divide-border text-sm'>
            {fontWeights.map(weight => (
              <li key={weight.name}>
                <button
                  type='button'
                  onClick={() => copy(weight.class)}
                  className='flex w-full items-center justify-between py-2.5 text-left hover:text-accent'
                >
                  <span className={`${weight.class} text-foreground`}>{weight.name}</span>
                  <code className='font-mono text-xs text-foreground-muted'>{weight.class}</code>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </ReferenceDisclosure>

      <TypographyLiveExamples />
    </div>
  );
}
