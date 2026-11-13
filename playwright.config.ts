import { defineConfig } from '@playwright/test';

/** E2E against the built site (npm run build first), served like the CDN would serve it. */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4300', channel: 'chrome' },
  webServer: {
    command: 'npx tsx scripts/serve-dist.ts',
    url: 'http://localhost:4300/',
    reuseExistingServer: true,
    env: { PORT: '4300' },
  },
});
