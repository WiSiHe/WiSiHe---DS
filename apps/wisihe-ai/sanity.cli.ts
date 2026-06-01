import { defineCliConfig } from 'sanity/cli';

/**
 * App SDK: CLI vs runtime config — https://www.sanity.io/docs/app-sdk/sdk-configuration
 * Deploy / CI — https://www.sanity.io/docs/app-sdk/sdk-deployment
 *
 * First hosted deploy: run **interactively** from the monorepo (`pnpm deploy:wisihe-ai`,
 * no `-y`) while logged in (`sanity login`). The CLI prompts to create/link the app, then
 * writes `deployment: { appId: '…' }` here (needed for `sanity undeploy` and for CI
 * `sanity deploy -y`).
 */
export default defineCliConfig({
  server: {
    port: 3334,
  },
  app: {
    organizationId: 'o9QnfPBim',
    entry: './src/App.tsx',
    title: 'WiSiHe bulk tools',
  },
  deployment: {
    autoUpdates: true,
    appId: 'ka7tolfx8perki9f97u2rugb',
  },
});
