import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home renders and has 0 serious/critical axe violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /accueil/i })).toBeVisible()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()
  const severe = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''))
  expect(severe, JSON.stringify(severe,null,2)).toHaveLength(0)
})
