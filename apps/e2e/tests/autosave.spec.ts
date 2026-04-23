import { test, expect } from '@playwright/test';

test.describe('Editor Auto-Save & Offline Recovery', () => {
  test('should debounce save and handle offline states', async ({ page }) => {
    // 1. Setup mocks
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { id: 'u1', email: 'test@test.com' } }) });
    });
    await page.route('**/api/v1/scripts/script1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { id: 'script1', title: 'Test Script', content: {} } }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });

    // Mock local storage to simulate being logged in
    await page.addInitScript(() => {
      window.localStorage.setItem('accessToken', 'fake-token');
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/editor/script1', { waitUntil: 'domcontentloaded' });

    // 2. Typing should trigger auto-save after debounce (2s)
    const editor = page.locator('[data-testid="editor-content-wrapper"] .ProseMirror');
    await editor.waitFor({ state: 'attached', timeout: 60000 });
    await editor.click();
    await editor.type('Hello world');
    
    // Check status becomes "saving"
    await expect(page.locator('[data-testid="save-status"]')).toContainText('Saving', { timeout: 15000 });

    // After 2s, check status becomes "saved"
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="save-status"]')).toContainText('saved', { timeout: 15000 });

    // 3. Simulate offline
    await page.route('**/api/v1/scripts/script1', (route) => route.abort('internetdisconnected'));

    await editor.type('Offline content');

    // Check status becomes "error" or "offline" or "syncing"
    await expect(page.locator('[data-testid="save-status"]')).toContainText(/Error|Offline|Syncing/i);

    // 4. Restore online
    await page.route('**/api/v1/scripts/script1', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });

    // Check it eventually saves
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="save-status"]')).toContainText('saved');
  });
});
