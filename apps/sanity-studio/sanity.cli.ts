import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_API_DATASET || '',
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    path: [
      '../nextjs-portfolio/sanity/**/*.{ts,tsx,js,jsx}',
      '../../packages/sanity-queries/src/**/*.{ts,tsx,js,jsx}',
    ],
    schema: './schema.json',
    generates: '../nextjs-portfolio/sanity.types.ts',
    overloadClientMethods: true,
  },
});
