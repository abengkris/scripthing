import { FastifyInstance } from 'fastify';

export const createProject = (prisma: any, userId: string, data: any) => 
  prisma.project.create({ data: { ...data, userId } });

export const listProjects = (prisma: any, userId: string) => 
  prisma.project.findMany({ where: { userId } });

export const getProject = (prisma: any, id: string) => 
  prisma.project.findUnique({ where: { id } });

export const updateProject = (prisma: any, id: string, data: any) => 
  prisma.project.update({ where: { id }, data });

export const deleteProject = (prisma: any, id: string) => 
  prisma.project.delete({ where: { id } });
