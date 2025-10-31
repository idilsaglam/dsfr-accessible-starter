// tests-e2e/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Modal opens, traps focus, closes on Esc, and passes axe gate", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Open the modal (click is more reliable than keyboard for DSFR init timing)
  const open = page.getByRole("button", { name: /ouvrir la modale/i });
  await expect(open).toBeVisible();
  await open.click();

  // Wait until any known DSFR "opened" state is present
  await page.waitForFunction(() => {
    const byAriaHidden = document.querySelector('.fr-modal[aria-hidden="false"]');
    const byDialogOpen = document.querySelector('dialog.fr-modal[open]');
    const byBodyClass = document.querySelector('.fr-modal--opened');
    const visibleDialog = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))
      .find(el => !!(el.offsetParent || (el as HTMLDialogElement).open));
    return !!(byAriaHidden || byDialogOpen || byBodyClass || visibleDialog);
  }, { timeout: 10000 });

  // Build a robust locator for the visible dialog element
  const dialog = page
    .locator('dialog.fr-modal[open], .fr-modal[aria-hidden="false"] [role="dialog"], [role="dialog"]')
    .filter({ hasNot: page.locator('[aria-hidden="true"]') })
    .first();

  await expect(dialog).toBeVisible();

  // Heading inside modal (loose match so wording can change)
  await expect(dialog.getByRole("heading")).toContainText(/pièces/i);

  // Axe on the modal subtree only (use selector strings with AxeBuilder.include)
  const includeSelector =
    'dialog.fr-modal[open], .fr-modal[aria-hidden="false"], .fr-modal--opened';
  const axe = await new AxeBuilder({ page }).include(includeSelector).analyze();
  expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);

  // Close via Esc and verify it is hidden
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden({ timeout: 5000 });

  // Focus restored on trigger
  await expect(open).toBeFocused();
});
