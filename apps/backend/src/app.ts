import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth';

export const buildApp = () => {
  const fastify = Fastify({ logger: true });

  fastify.register(cors, {
    origin: config.FRONTEND_URL,
  });

  errorMiddleware(fastify);

  fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  return fastify;
};
