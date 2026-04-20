import { authRoutes } from '../routes/auth';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Auth Routes', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.register(authRoutes, { prefix: '/auth' });
  });

  it('should register a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'test@example.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(201);
  });

  it('should login a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'test@example.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toHaveProperty('token');
  });
});
