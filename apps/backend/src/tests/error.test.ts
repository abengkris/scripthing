import { errorMiddleware, AppError } from '../middleware/error.middleware';
import { buildApp } from '../app';
import { describe, it, expect } from 'vitest';

describe('Error Middleware', () => {
  
  it('should handle AppError', async () => {
    const app = buildApp();
    errorMiddleware(app);
    // Use unique routes for each test case
    app.get('/test-app-error', async () => {
        throw new AppError(400, 'Bad Request');
    });
    
    const res = await app.inject({
      method: 'GET',
      url: '/test-app-error',
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload)).toEqual({ statusCode: 400, message: 'Bad Request' });
  });

  it('should handle unknown errors', async () => {
    const app = buildApp();
    errorMiddleware(app);
    app.get('/test-unknown-error', async () => {
        throw new Error('Unknown');
    });
    
    const res = await app.inject({
      method: 'GET',
      url: '/test-unknown-error',
    });
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.payload)).toEqual({ statusCode: 500, message: 'Internal server error' });
  });
});
