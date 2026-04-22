import { PrismaClient } from "@prisma/client";

export const createScript = (
  prisma: PrismaClient,
  projectId: string,
  data: Record<string, unknown>,
) =>
  prisma.script.create({
    data: { ...data, projectId } as {
      title: string;
      content: string;
      projectId: string;
      [key: string]: any;
    },
  });

export const listScripts = (prisma: PrismaClient, projectId: string) =>
  prisma.script.findMany({ where: { projectId } });

export const getScript = (prisma: PrismaClient, id: string) =>
  prisma.script.findUnique({ where: { id } });

export const updateScript = (
  prisma: PrismaClient,
  id: string,
  data: Record<string, unknown>,
) =>
  prisma.script.update({
    where: { id },
    data: data as { title?: string; content?: string; [key: string]: any },
  });

export const deleteScript = (prisma: PrismaClient, id: string) =>
  prisma.script.delete({ where: { id } });
