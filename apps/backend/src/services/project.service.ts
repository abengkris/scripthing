import { PrismaClient, Prisma } from "@prisma/client";

export const createProject = (
  prisma: PrismaClient,
  userId: string,
  data: Prisma.ProjectCreateInput,
) =>
  prisma.project.create({
    data: { ...data, user: { connect: { id: userId } } },
  });

export const listProjects = (prisma: PrismaClient, userId: string) =>
  prisma.project.findMany({ where: { userId } });

export const getProject = (prisma: PrismaClient, id: string) =>
  prisma.project.findUnique({ where: { id } });

export const updateProject = (
  prisma: PrismaClient,
  id: string,
  data: Prisma.ProjectUpdateInput,
) =>
  prisma.project.update({
    where: { id },
    data,
  });

export const deleteProject = (prisma: PrismaClient, id: string) =>
  prisma.project.delete({ where: { id } });
