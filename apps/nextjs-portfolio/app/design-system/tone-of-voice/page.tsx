'use client';

import { DesignSystemPageHeader } from '../components/DesignSystemPageHeader';
import { ToneLiveExamples } from '../components/demos/ToneLiveExamples';

export default function ToneOfVoicePage() {
  return (
    <div className='px-4 py-10 md:px-0'>
      <DesignSystemPageHeader
        title='Tone of voice'
        description='Write as we design: direct, warm, and efficient. No hype, no blame-the-user jokes.'
      />

      <ToneLiveExamples />
    </div>
  );
}
