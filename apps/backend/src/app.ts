import fastify from 'fastify';
import cors from '@fastify/cors';
import { setupErrorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth';
import { config } from './config';

export const buildApp = () => {
  const app = fastify({ logger: false });

  app.register(cors, { origin: config.FRONTEND_URL });
  setupErrorMiddleware(app);
  app.register(authRoutes, { prefix: '/api/v1/auth' });

  return app;
};
