import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Combobox filters, navigates, selects, and passes axe gate", async ({ page }) => {
  await page.goto("/justificatifs");

  const input = page.getByRole("combobox", { name: "Ville" });
  await input.click();
  await input.type("bor");

  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible();

  // Should contain Bordeaux
  const option = page.getByRole("option", { name: "Bordeaux" });
  await expect(option).toBeVisible();

  // Keyboard select
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // Value committed
  await expect(input).toHaveValue(/bordeaux/i);
  await expect(listbox).toBeHidden();

  // Axe on the component subtree
  const container = page.locator("#content"); // page main; keeps noise low
  const results = await new AxeBuilder({ page }).include(container).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
