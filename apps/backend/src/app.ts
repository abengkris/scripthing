import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth';
import { projectRoutes } from './routes/projects';
import { scriptRoutes } from './routes/scripts';
import { settingsRoutes } from './routes/settings';
import { aiRoutes } from './routes/ai';

export const buildApp = () => {
  const fastify = Fastify({ logger: true });

  fastify.register(cors, {
    origin: config.FRONTEND_URL,
    credentials: true,
  });

  errorMiddleware(fastify);

  fastify.get('/api/v1/health', async () => ({ status: 'ok' }));

  // Routes
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  fastify.register(projectRoutes, { prefix: '/api/v1/projects' });
  fastify.register(scriptRoutes, { prefix: '/api/v1' }); // Prefix handled in file for nested
  fastify.register(settingsRoutes, { prefix: '/api/v1/settings' });
  fastify.register(aiRoutes, { prefix: '/api/v1/ai' });

  return fastify;
};
