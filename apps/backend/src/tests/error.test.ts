import { setupErrorMiddleware, AppError } from '../middleware/error.middleware';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Error Middleware', () => {
  const app = buildApp();
  
  beforeAll(() => {
    setupErrorMiddleware(app);
    app.get('/test-error', async () => {
      throw new AppError(400, 'Bad Request');
    });
    app.get('/test-unknown', async () => {
      throw new Error('Unknown');
    });
  });

  it('should handle AppError', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/test-error',
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload)).toEqual({ error: 'Bad Request' });
  });

  it('should handle unknown errors', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/test-unknown',
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.payload)).toEqual({ error: 'Internal Server Error' });
  });
});
