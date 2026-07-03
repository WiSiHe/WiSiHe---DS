'use client';

import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { MotionLiveExamples } from '../components/demos/MotionLiveExamples';
import { ReferenceDisclosure } from '../components/ReferenceDisclosure';
import { motionDurations, motionLibraries, motionSnippet } from '../motion-data';

export default function MotionPage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Motion'
        description='Calm and purposeful. Respect prefers-reduced-motion.'
      />

      <ReferenceDisclosure title='Timing, libraries & snippet'>
        <div className='space-y-8'>
          <div>
            <p className='mb-3 text-xs font-medium uppercase tracking-wider text-foreground-muted'>
              Durations
            </p>
            <dl className='grid grid-cols-1 gap-2 text-sm sm:grid-cols-2'>
              {motionDurations.map(row => (
                <div
                  key={row.token}
                  className='flex justify-between gap-4 rounded-lg border border-border/60 px-3 py-2'
                >
                  <dt className='font-mono text-accent'>{row.token}</dt>
                  <dd className='text-right text-foreground-subtle'>
                    {row.ms}ms — {row.use}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className='mb-3 text-xs font-medium uppercase tracking-wider text-foreground-muted'>
              Libraries
            </p>
            <ul className='space-y-2 text-sm'>
              {motionLibraries.map(lib => (
                <li key={lib.name} className='rounded-lg border border-border/60 px-3 py-2'>
                  <span className='font-mono text-foreground'>{lib.name}</span>
                  <span className='text-foreground-muted'> — {lib.when}</span>
                </li>
              ))}
            </ul>
          </div>
          <pre className='overflow-x-auto rounded-lg border border-border bg-background p-3 text-[11px] leading-relaxed text-foreground-subtle'>
            <code>{motionSnippet}</code>
          </pre>
        </div>
      </ReferenceDisclosure>

      <MotionLiveExamples />
    </div>
  );
}
