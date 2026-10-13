import { createFileRoute } from '@tanstack/react-router';
import { DesignSystemPageHeader } from '../../../components/design-system/DesignSystemPageHeader';
import { ToneLiveExamples } from '../../../components/design-system/demos/ToneLiveExamples';
import { buildHead } from '../../../lib/seo';

export const Route = createFileRoute('/design-system/tone-of-voice/')({
  head: () =>
    buildHead({
      title: 'Tone of Voice | Design System | WiSiHe',
      description:
        'Content guidelines, copywriting, and tone of voice for the WiSiHe design system.',
      path: '/design-system/tone-of-voice',
      noIndex: true,
    }),
  component: ToneOfVoicePage,
});

function ToneOfVoicePage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Tone of voice'
        description='Direct and calm. Say what happened and what to do next.'
      />

      <ToneLiveExamples />
    </div>
  );
}
