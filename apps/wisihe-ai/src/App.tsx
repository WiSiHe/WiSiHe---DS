import type { SanityConfig } from '@sanity/sdk-react';
import { SanityApp } from '@sanity/sdk-react';
import { Suspense, useState } from 'react';

import { BulkContentApp } from './BulkContentApp';
import { EditorialWorkspace } from './components/editor/EditorialWorkspace';
import { DATASET, PROJECT_ID } from './sanityEnv';
import './App.css';

export type MainTab = 'editorial' | 'bulk';

function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('editorial');

  const sanityConfigs: SanityConfig[] = [
    {
      projectId: PROJECT_ID || 'cbjsv7wi',
      dataset: DATASET || 'production',
    },
  ];

  return (
    <div className='app-container'>
      <SanityApp
        config={sanityConfigs}
        fallback={
          <div className='studio-loading-screen'>
            <div className='studio-spinner' />
            <span className='muted small'>Initializing WiSiHe Studio…</span>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className='studio-loading-screen'>
              <div className='studio-spinner' />
              <span className='muted small'>Loading workspace…</span>
            </div>
          }
        >
          {activeTab === 'editorial' ? (
            <EditorialWorkspace activeTab={activeTab} onTabChange={setActiveTab} />
          ) : (
            <BulkContentApp activeTab={activeTab} onTabChange={setActiveTab} />
          )}
        </Suspense>
      </SanityApp>
    </div>
  );
}

export default App;
