import { FastifyInstance } from 'fastify';
import * as scriptService from '../services/script.service';

export default async function (fastify: FastifyInstance) {
  fastify.post('/projects/:projectId/scripts', async (request: any, reply) => {
    return await scriptService.createScript(fastify.prisma, (request.params as any).projectId, request.body);
  });

  fastify.get('/projects/:projectId/scripts', async (request: any, reply) => {
    return await scriptService.listScripts(fastify.prisma, (request.params as any).projectId);
  });

  fastify.get('/scripts/:id', async (request: any, reply) => {
    return await scriptService.getScript(fastify.prisma, (request.params as any).id);
  });

  fastify.put('/scripts/:id', async (request: any, reply) => {
    return await scriptService.updateScript(fastify.prisma, (request.params as any).id, request.body);
  });

  fastify.delete('/scripts/:id', async (request: any, reply) => {
    return await scriptService.deleteScript(fastify.prisma, (request.params as any).id);
  });
}
