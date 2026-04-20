import fastify from 'fastify';
import { setupErrorMiddleware, AppError } from './middleware/error.middleware';
import { validate } from './middleware/validation.middleware';
import { z } from 'zod';

export const buildApp = () => {
  const app = fastify({
    logger: false,
  });

  setupErrorMiddleware(app);

  // Routes for manual verification
  app.get('/test-error', async () => {
    throw new AppError(400, 'Bad Request');
  });

  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  app.post('/test-validate', { preHandler: validate(schema) }, async (req, reply) => {
    reply.send(req.body);
  });

  return app;
};
