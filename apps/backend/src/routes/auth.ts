import { FastifyInstance } from 'fastify';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from './auth.schema';
import { validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

export default async function authRoutes(app: FastifyInstance) {
  app.post('/register', { preHandler: validate(registerSchema) }, async (req, reply) => {
    const user = await authService.register(req.body as any);
    return reply.status(201).send(user);
  });

  app.post('/login', { preHandler: validate(loginSchema) }, async (req, reply) => {
    const user = await authService.login(req.body as any);
    return reply.send(user);
  });

  app.post('/logout', async (_req, reply) => {
    return reply.send({ message: 'Logged out' });
  });

  app.get('/me', { preHandler: authMiddleware }, async (req, reply) => {
    // Basic implementation: fetch from DB
    return reply.send({ userId: req.userId });
  });
}
