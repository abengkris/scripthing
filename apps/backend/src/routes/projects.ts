import { FastifyInstance } from 'fastify';
import * as projectService from '../services/project.service';

export default async function (fastify: FastifyInstance) {
  fastify.post('/projects', async (request: any, reply) => {
    return await projectService.createProject(fastify.prisma, request.user.id, request.body);
  });

  fastify.get('/projects', async (request: any, reply) => {
    return await projectService.listProjects(fastify.prisma, request.user.id);
  });

  fastify.get('/projects/:id', async (request: any, reply) => {
    return await projectService.getProject(fastify.prisma, (request.params as any).id);
  });

  fastify.put('/projects/:id', async (request: any, reply) => {
    return await projectService.updateProject(fastify.prisma, (request.params as any).id, request.body);
  });

  fastify.delete('/projects/:id', async (request: any, reply) => {
    return await projectService.deleteProject(fastify.prisma, (request.params as any).id);
  });
}
