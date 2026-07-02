import { defineCliConfig } from 'sanity/cli';
import { studioDataset, studioProjectId } from './lib/env';

export default defineCliConfig({
  api: {
    projectId: studioProjectId() || '',
    dataset: studioDataset(),
  },
  deployment: {
    autoUpdates: true,
    appId: '524f8ded9f7d9cbde954c6ba',
  },
  typegen: {
    path: [
      '../nextjs-portfolio/sanity/**/*.{ts,tsx,js,jsx}',
      '../tanstack-start-portfolio/src/**/*.{ts,tsx,js,jsx}',
      '../../packages/sanity-queries/src/**/*.{ts,tsx,js,jsx}',
    ],
    schema: './schema.json',
    generates: '../../packages/sanity-queries/src/sanity.types.ts',
    overloadClientMethods: true,
  },
});
