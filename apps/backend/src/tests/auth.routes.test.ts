import { describe, it, expect } from 'vitest';
import { buildApp } from '../app';

describe('Auth Routes', () => {
  const app = buildApp();

  it('should register a new user successfully', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { email: 'new@example.com', password: 'password123', name: 'New User' },
    });
    
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
  });

  it('should login an existing user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'exist@example.com', password: 'password123' },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('exist@example.com');
  });

  it('should refresh a token', async () => {
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'exist@example.com', password: 'password123' },
    });
    const loginBody = JSON.parse(loginRes.payload);
    const refreshToken = loginBody.data.refreshToken;

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });
    
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload).success).toBe(true);
  });

  it('should get current user (/me)', async () => {
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'exist@example.com', password: 'password123' },
    });
    const { accessToken } = JSON.parse(loginRes.payload).data;

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe('exist@example.com');
  });
});
