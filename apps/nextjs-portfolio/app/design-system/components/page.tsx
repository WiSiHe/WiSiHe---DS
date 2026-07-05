'use client';

import { IconExternalLink } from '@tabler/icons-react';
import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { STORYBOOK_URL, storybookStoryPaths, uiReactComponents } from '../token-data';

export default function ComponentsPage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Components'
        description='@wisihe/ui-react — variants and a11y in Storybook.'
      >
        <a
          href={STORYBOOK_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast hover:bg-accent-hover'
        >
          Open Storybook
          <IconExternalLink className='size-3.5' stroke={2} aria-hidden />
        </a>
      </DesignSystemPageHeader>

      <section className='mb-0'>
        <ul className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
          {uiReactComponents.map(component => {
            const storyPath = storybookStoryPaths[component.name];
            const href = storyPath ? `${STORYBOOK_URL}${storyPath}` : STORYBOOK_URL;

            return (
              <li key={component.name}>
                <a
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex flex-col rounded-lg border border-border bg-surface/40 px-3 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent'
                >
                  <span className='font-medium'>{component.name}</span>
                  <span className='text-[10px] uppercase tracking-wider text-foreground-muted'>
                    {component.category}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
