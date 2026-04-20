import { FastifyInstance } from 'fastify';

export const createScript = (prisma: any, projectId: string, data: any) => 
  prisma.script.create({ data: { ...data, projectId } });

export const listScripts = (prisma: any, projectId: string) => 
  prisma.script.findMany({ where: { projectId } });

export const getScript = (prisma: any, id: string) => 
  prisma.script.findUnique({ where: { id } });

export const updateScript = (prisma: any, id: string, data: any) => 
  prisma.script.update({ where: { id }, data });

export const deleteScript = (prisma: any, id: string) => 
  prisma.script.delete({ where: { id } });
