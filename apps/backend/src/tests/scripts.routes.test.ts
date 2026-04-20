import { scriptRoutes } from '../routes/scripts';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Script Routes', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.register(scriptRoutes, { prefix: '/scripts' });
  });

  it('should list scripts', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/scripts/proj1/scripts',
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toHaveProperty('scripts');
  });

  it('should create a script', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/scripts/proj1/scripts',
      payload: { title: 'New Script', content: '{}' },
    });
    expect(res.statusCode).toBe(201);
  });
});
