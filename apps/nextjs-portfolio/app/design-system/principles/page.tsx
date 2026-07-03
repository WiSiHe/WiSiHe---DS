'use client';

import Link from 'next/link';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { ShapeLanguagePreview } from '../components/ShapeLanguagePreview';
import { shapeLanguage, shapeNestingRule } from '../layout-data';
import { goldenRules } from '../principles-data';

export default function PrinciplesPage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Principles'
        description='Five rules, then shape language — small (chips) → medium (cards) → big (sections).'
      />

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-bold text-foreground'>Golden rules</h2>
        <ol className='space-y-3'>
          {goldenRules.map((rule, index) => (
            <li
              key={rule.title}
              className='flex gap-3 rounded-xl border border-accent/25 bg-accent/5 p-4 text-sm'
            >
              <span className='font-mono text-[10px] font-bold text-accent'>{index + 1}</span>
              <p className='leading-relaxed text-foreground-subtle'>
                <span className='font-semibold text-foreground'>{rule.title}.</span> {rule.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className='mb-0'>
        <h2 className='mb-1 text-lg font-bold text-foreground'>Shape language</h2>
        <p className='mb-6 text-sm text-foreground-muted'>
          {shapeNestingRule}{' '}
          <Link href='/design-system/layout' className='text-accent hover:underline'>
            Layout tokens →
          </Link>
        </p>

        <div className='space-y-8'>
          {shapeLanguage.map(tier => (
            <article
              key={tier.scale}
              className='grid grid-cols-1 gap-4 border-b border-border pb-8 last:border-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
            >
              <ShapeLanguagePreview scale={tier.scale} />
              <div className='min-w-0'>
                <h3 className='font-semibold text-foreground'>{tier.label}</h3>
                <p className='mt-1 font-mono text-xs text-foreground-muted'>
                  {tier.radiusClasses} · {tier.padding} · {tier.gap}
                </p>
                <p className='mt-3 text-sm text-foreground-subtle'>{tier.guidance}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
