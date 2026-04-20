import { settingsRoutes } from '../routes/settings';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Settings Routes', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.register(settingsRoutes, { prefix: '/settings' });
  });

  it('should get settings', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/settings',
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toHaveProperty('theme');
  });

  it('should update settings', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/settings',
      payload: { theme: 'light', fontSize: 14 },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual({ message: 'Settings updated' });
  });
});
