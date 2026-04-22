import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export const errorMiddleware = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    request.log.error(error);
    reply.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  });
};

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}
