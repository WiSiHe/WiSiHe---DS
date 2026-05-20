import type { SanityConfig } from '@sanity/sdk-react';
import { SanityApp } from '@sanity/sdk-react';
import { Suspense } from 'react';

import { BulkContentApp } from './BulkContentApp';
import { DATASET, PROJECT_ID } from './sanityEnv';
import './App.css';

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: PROJECT_ID || 'ns25bkom',
      dataset: DATASET || 'production',
    },
  ];

  return (
    <div className='app-container'>
      <SanityApp config={sanityConfigs} fallback={<div>Loading…</div>}>
        <Suspense fallback={<div className='muted'>Loading workspace…</div>}>
          <BulkContentApp />
        </Suspense>
      </SanityApp>
    </div>
  );
}

export default App;
