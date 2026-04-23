import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export const errorMiddleware = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        message: "Validation error",
        errors: (error as any).issues.map(
          (e: { path: (string | number)[]; message: string }) => ({
            field: e.path.join("."),
            message: e.message,
          }),
        ),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    _request.log.error(error);
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
