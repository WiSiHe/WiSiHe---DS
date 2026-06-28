'use client';

import Link from 'next/link';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { ShapeLiveExamples } from '../components/demos/ShapeLiveExamples';
import { ShapeLanguagePreview } from '../components/ShapeLanguagePreview';
import { shapeLanguage, shapeNestingRule } from '../layout-data';
import { goldenRules } from '../principles-data';

export default function PrinciplesPage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Principles'
        description='Golden rules are non-negotiable guardrails. Shape language defines how corners, padding, and density scale from micro UI (small) through components (medium) to page sections (big).'
      />

      <section className='mb-12'>
        <h2 className='mb-1 text-lg font-bold text-foreground'>Golden rules</h2>
        <p className='mb-4 text-sm text-foreground-muted'>
          Always apply — regardless of shape scale.
        </p>
        <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {goldenRules.map((rule, index) => (
            <li key={rule.title} className='rounded-xl border border-accent/25 bg-accent/5 p-4'>
              <span className='font-mono text-[10px] font-bold text-accent'>{index + 1}</span>
              <h3 className='mt-1 font-semibold text-foreground'>{rule.title}</h3>
              <p className='mt-1 text-sm leading-relaxed text-foreground-subtle'>{rule.body}</p>
              {rule.href ? (
                <Link
                  href={rule.href}
                  className='mt-3 inline-block text-xs font-medium text-accent hover:underline'
                >
                  See {rule.href.replace('/design-system/', '')} →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className='mb-12'>
        <h2 className='mb-1 text-lg font-bold text-foreground'>Shape language</h2>
        <p className='mb-6 max-w-2xl text-sm text-foreground-muted'>
          Three scales of corner radius, padding, and presence. Pick the scale that matches the UI
          element&apos;s job — not its importance. Token values live on the{' '}
          <Link href='/design-system/layout' className='text-accent hover:underline'>
            Layout
          </Link>{' '}
          page.
        </p>

        <div className='mb-6 rounded-xl border border-border bg-surface/30 px-4 py-3 text-sm text-foreground-subtle'>
          {shapeNestingRule}
        </div>

        <div className='space-y-8'>
          {shapeLanguage.map(tier => (
            <article
              key={tier.scale}
              className='grid grid-cols-1 gap-6 border-b border-border pb-8 last:border-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]'
            >
              <ShapeLanguagePreview scale={tier.scale} />

              <div className='min-w-0'>
                <h3 className='text-base font-bold text-foreground'>{tier.label}</h3>
                <p className='mt-1 text-sm text-foreground-muted'>{tier.subtitle}</p>

                <dl className='mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
                  <div className='rounded-lg border border-border/60 bg-surface/40 px-3 py-2'>
                    <dt className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted'>
                      Radius
                    </dt>
                    <dd className='mt-0.5 font-mono text-xs text-foreground'>
                      {tier.radiusClasses}
                    </dd>
                    <dd className='text-[10px] text-foreground-muted'>{tier.radius}</dd>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-surface/40 px-3 py-2'>
                    <dt className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted'>
                      Padding
                    </dt>
                    <dd className='mt-0.5 font-mono text-xs text-foreground'>{tier.padding}</dd>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-surface/40 px-3 py-2'>
                    <dt className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted'>
                      Gap
                    </dt>
                    <dd className='mt-0.5 font-mono text-xs text-foreground'>{tier.gap}</dd>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-surface/40 px-3 py-2'>
                    <dt className='text-[10px] font-bold uppercase tracking-wider text-foreground-muted'>
                      Shadow
                    </dt>
                    <dd className='mt-0.5 font-mono text-xs text-foreground'>{tier.shadow}</dd>
                  </div>
                </dl>

                <p className='mt-4 text-sm text-foreground-subtle'>{tier.guidance}</p>
                <p className='mt-2 text-xs text-foreground-muted'>
                  <span className='font-medium text-foreground'>Avoid:</span> {tier.avoid}
                </p>

                <p className='mt-3 flex flex-wrap gap-1.5'>
                  {tier.examples.map(example => (
                    <span
                      key={example}
                      className='rounded-md border border-border bg-background px-2 py-0.5 text-[10px] text-foreground-muted'
                    >
                      {example}
                    </span>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ShapeLiveExamples />
    </div>
  );
}
