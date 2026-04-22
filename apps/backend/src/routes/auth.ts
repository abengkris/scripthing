import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { register, login, refresh, logout } from "../services/auth.service";
import { registerSchema, loginSchema } from "./auth.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/register",
    { preValidation: validate(registerSchema) },
    async (req: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) => {
      const result = await register(
        req.body as { email: string; password: string; name?: string },
      ); // cast to expected type
      reply.status(201).send({ success: true, data: result });
    },
  );

  fastify.post(
    "/login",
    { preValidation: validate(loginSchema) },
    async (req: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) => {
      const result = await login(
        req.body as { email: string; password: string },
      );
      reply.status(200).send({ success: true, data: result });
    },
  );

  fastify.post(
    "/refresh",
    { preValidation: validate(refreshSchema) },
    async (req: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) => {
      const result = await refresh(
        (req.body as { refreshToken: string }).refreshToken,
      );
      reply.status(200).send({ success: true, data: result });
    },
  );

  fastify.post("/logout", async (_req, reply) => {
    await logout();
    reply.status(200).send({ success: true, message: "Logged out" });
  });

  fastify.get(
    "/me",
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user)
        return reply
          .status(401)
          .send({ success: false, message: "Unauthorized" });

      reply.status(200).send({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    },
  );
}
