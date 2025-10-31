import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: 'tests-e2e',
  use: { headless: true, baseURL: 'http://localhost:4173' },
  reporter: 'list',
})
