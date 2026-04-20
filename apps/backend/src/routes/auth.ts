import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { register, login } from '../services/auth.service';
import { registerSchema, loginSchema } from './auth.schema';
import { authMiddleware } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.post('/register', { schema: { body: registerSchema } }, async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    const result = await register(req.body);
    reply.status(201).send(result);
  });

  fastify.post('/login', { schema: { body: loginSchema } }, async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    const result = await login(req.body);
    reply.status(200).send(result);
  });

  fastify.post('/logout', async (req, reply) => {
    reply.status(200).send({ message: 'Logged out' });
  });

  fastify.get('/me', { preHandler: authMiddleware }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return reply.status(401).send({ message: 'Unauthorized' });
    
    reply.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  });
}
