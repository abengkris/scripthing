import { scriptRoutes } from '../routes/scripts';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Script PDF Export', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.register(scriptRoutes, { prefix: '/scripts' });
  });

  it('should export script to PDF', async () => {
    // Assuming a script 'script1' exists from seed data
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/scripts/script1/export/pdf',
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
  }, 30000);

  it('should export script to FDX', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/scripts/script1/export/fdx',
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/xml');
  });
});
