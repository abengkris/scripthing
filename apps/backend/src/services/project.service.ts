import { PrismaClient } from "@prisma/client";

export const createProject = (
  prisma: PrismaClient,
  userId: string,
  data: Record<string, unknown>,
) =>
  prisma.project.create({
    data: { ...data, userId } as {
      email?: string;
      name: string;
      userId: string;
      [key: string]: any;
    },
  });

export const listProjects = (prisma: PrismaClient, userId: string) =>
  prisma.project.findMany({ where: { userId } });

export const getProject = (prisma: PrismaClient, id: string) =>
  prisma.project.findUnique({ where: { id } });

export const updateProject = (
  prisma: PrismaClient,
  id: string,
  data: Record<string, unknown>,
) =>
  prisma.project.update({
    where: { id },
    data: data as { name?: string; [key: string]: any },
  });

export const deleteProject = (prisma: PrismaClient, id: string) =>
  prisma.project.delete({ where: { id } });
