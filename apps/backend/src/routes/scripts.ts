import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

const scriptSchema = z.object({
  title: z.string().min(1),
  content: z.string(), // JSON string
});

export const scriptRoutes = async (app: FastifyInstance) => {
  // GET /projects/:projectId/scripts
  app.get('/:projectId/scripts', async (request) => {
    const { projectId } = request.params as { projectId: string };
    return { scripts: [] }; // Mock
  });

  // POST /projects/:projectId/scripts
  app.post('/:projectId/scripts', { preHandler: validate(scriptSchema) }, async (request, reply) => {
    reply.status(201).send({ message: 'Script created' });
  });

  // GET /scripts/:id
  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string };
    return { id, title: 'Mock Script', content: '{}' };
  });

  // POST /scripts/:id/snapshot
  app.post('/:id/snapshot', async (request, reply) => {
    reply.status(201).send({ message: 'Snapshot saved' });
  });
};
