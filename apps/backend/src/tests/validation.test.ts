import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';
import { errorMiddleware } from '../middleware/error.middleware';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Validation Middleware', () => {
  const app = buildApp();
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  beforeAll(async () => {
    errorMiddleware(app);
    try {
        app.post('/test-validate', { preHandler: validate(schema) }, async (req, reply) => {
        reply.send(req.body);
        });
    } catch (e) {
        // Route already exists, ignore
    }
  });

  it('should pass validation', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/test-validate',
      payload: { name: 'John', age: 30 },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual({ name: 'John', age: 30 });
  });

  it('should fail validation', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/test-validate',
      payload: { name: 'John' }, // Missing age
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).message).toContain('age');
  });
});
