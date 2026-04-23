import { test, expect } from '@playwright/test';

test.describe('Editor Auto-Save & Offline Recovery', () => {
  test('should debounce save and handle offline states', async ({ page }) => {
    // 1. Setup mocks
    await page.route('/api/v1/scripts/script1', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    await page.goto('/editor/script1');

    // 2. Typing should trigger auto-save after debounce (2s)
    const editor = page.locator('[data-testid="editor-content"]');
    await editor.waitFor({ state: 'attached' });
    await editor.click();
    await editor.type('Hello world');
    
    // Check status becomes "saving"
    await expect(page.locator('[data-testid="save-status"]')).toContainText('Saving');

    // After 2s, check status becomes "saved"
    await page.waitForTimeout(2500);
    await expect(page.locator('[data-testid="save-status"]')).toContainText('saved');

    // 3. Simulate offline
    await page.route('/api/v1/scripts/script1', (route) => route.abort('internetdisconnected'));

    await page.fill('.screenplay-editor', 'Offline content');

    // Check status becomes "error" or "offline"
    await expect(page.locator('[data-testid="save-status"]')).toContainText(/Error|Offline/);

    // 4. Restore online
    await page.route('/api/v1/scripts/script1', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    // Check it eventually saves
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="save-status"]')).toContainText('saved');
  });
});
