import { expect, test } from '@playwright/test';

test('CRA checker: full keyboard run-through to a result', async ({ page }) => {
  await page.goto('/cra-readiness');
  await page.getByRole('button', { name: 'Start the check' }).click();
  await expect(page.locator('#cra-progress-label')).toHaveText('Question 1 of 8');
  for (let q = 1; q <= 8; q++) {
    await expect(page.locator('#cra-progress-label')).toHaveText(`Question ${q} of 8`);
    await expect(page.locator('.question__text')).toBeFocused(); // focus moved to the new question
    await page.keyboard.press('Tab'); // first radio
    await page.keyboard.press('Space');
    const next = page.getByRole('button', { name: q === 8 ? 'See my result' : 'Next' });
    await expect(next).toBeEnabled();
    await next.focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#cra-result-title')).toBeFocused();
  await expect(page.locator('.result__actions li')).toHaveCount(3);
});

test('standards explorer: deep link restores tab and search', async ({ page }) => {
  await page.goto('/product/standards?std=CRA&q=SBOM');
  await expect(page.getByRole('tab', { name: /EU CRA/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#explorer-search')).toHaveValue('SBOM');
  await expect(page.locator('app-control-row')).toHaveCount(1);
  await page.locator('app-control-row summary').click();
  await page.getByRole('button', { name: 'Highlight every control Trivy supports' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Trivy supports' })).toBeVisible();
});

test('sample report: filters mirror the URL and show the empty state', async ({ page }) => {
  await page.goto('/product/sample-report');
  await expect(page.locator('app-findings-table tbody > tr:not(.detail)')).toHaveCount(10);
  await page.getByRole('button', { name: /^High/ }).click();
  await expect(page).toHaveURL(/sev=high/);
  await expect(page.locator('app-findings-table tbody > tr:not(.detail)')).toHaveCount(2);
  await page.getByLabel('Exploited only (KEV)').check();
  await expect(page.getByText('No findings match these filters.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('app-findings-table tbody > tr:not(.detail)')).toHaveCount(10);
  await expect(page.getByLabel('New since last scan')).toBeDisabled();
  await page.getByRole('tab', { name: 'Controls' }).click();
  await expect(page).toHaveURL(/tab=controls/);
});

test('pricing: billing persists in the URL', async ({ page }) => {
  await page.goto('/pricing?billing=yearly');
  await expect(page.getByRole('radio', { name: /Yearly/ })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('radio', { name: 'Monthly' }).click();
  await expect(page).not.toHaveURL(/billing=/);
});

test('pipeline: steps are buttons that show their copy', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/how-it-works');
  await page.getByRole('button', { name: /Step 6: Score/ }).click();
  await expect(page.locator('#pipeline-body-5')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause' })).toHaveCount(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('FAQ accordion still opens and the pipeline steps are readable', async ({ page }) => {
    await page.goto('/');
    const summary = page.locator('summary', { hasText: 'Does my source code leave my company?' });
    await summary.click();
    await expect(page.getByText('Only the signed results move, and only if you send them.')).toBeVisible();
    // Real no-JS browsers apply the <noscript> styles; here the narrow layout lists every step.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/how-it-works');
    await expect(page.getByText('Duplicate findings are merged')).toBeVisible();
    await expect(page.getByText('Your CI can fail the build on high-severity findings.')).toBeVisible();
  });
});
