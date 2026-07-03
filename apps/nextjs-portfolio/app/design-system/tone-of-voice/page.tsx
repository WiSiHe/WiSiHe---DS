'use client';

import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { ToneLiveExamples } from '../components/demos/ToneLiveExamples';

export default function ToneOfVoicePage() {
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
