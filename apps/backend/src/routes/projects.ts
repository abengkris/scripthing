import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  format: z.string().default('screenplay'),
});

export const projectRoutes = async (app: FastifyInstance) => {
  // GET /projects
  app.get('/', async () => {
    return { projects: [] }; // Mock: TODO: Add DB integration
  });

  // POST /projects
  app.post('/', { preHandler: validate(projectSchema) }, async (request, reply) => {
    // TODO: Add DB integration
    reply.status(201).send({ message: 'Project created' });
  });

  // GET /projects/:id
  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string };
    return { id, title: 'Mock Project' }; // Mock: TODO: Add DB integration
  });
};
