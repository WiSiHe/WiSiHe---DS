import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    // eslint-disable-next-line no-undef
    projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || '',
    // eslint-disable-next-line no-undef
    dataset: process.env.SANITY_STUDIO_API_DATASET || '',
  },
  autoUpdates: true,
});
