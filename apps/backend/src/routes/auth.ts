import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validation.middleware';
import { AppError } from '../middleware/error.middleware';

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const authRoutes = async (app: FastifyInstance) => {
  // TODO: Implement actual DB user creation once Prisma is resolved/replaced
  app.post('/register', { preHandler: validate(registerSchema) }, async (request, reply) => {
    // const { email, password, name } = request.body as any;
    // const passwordHash = await authService.hashPassword(password);
    // ... logic to save user
    reply.status(201).send({ message: 'User registered' });
  });

  app.post('/login', async (request, reply) => {
    // ... logic to verify credentials and sign JWT
    reply.status(200).send({ token: 'mock-jwt-token' });
  });
};
